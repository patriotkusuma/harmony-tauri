use rumqttc::{AsyncClient, Event, Incoming, MqttOptions, QoS};
use serde::Serialize;
use serde_json::{json, Value};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tauri::{AppHandle, Emitter, State};

const BROKER_HOST: &str = "harmonylaundry.my.id";
const BROKER_PORT: u16 = 37879;
const MQTT_USERNAME: &str = "harmony";
const MQTT_PASSWORD: &str = "Manisku212";
const MQTT_TOPICS: [&str; 3] = [
  "harmony/rfid/+/events",
  "harmony/rfid/events",
  "harmony/rfid/+/status",
];

#[derive(Clone, Default)]
pub struct MqttState {
  inner: Arc<MqttStateInner>,
}

#[derive(Default)]
struct MqttStateInner {
  status: Mutex<MqttStatus>,
  devices: Mutex<HashMap<String, String>>,
}

#[derive(Clone, Serialize)]
struct MqttStatus {
  status: String,
  #[serde(skip_serializing_if = "Option::is_none")]
  message: Option<String>,
}

impl Default for MqttStatus {
  fn default() -> Self {
    Self {
      status: "connecting".to_string(),
      message: None,
    }
  }
}

#[tauri::command]
pub fn mqtt_get_status(state: State<'_, MqttState>) -> Value {
  state.snapshot()
}

impl MqttState {
  fn set_status(&self, status: &str, message: Option<String>) {
    if let Ok(mut guard) = self.inner.status.lock() {
      guard.status = status.to_string();
      guard.message = message;
    }
  }

  fn set_device_status(&self, device_id: String, status: String) {
    if let Ok(mut guard) = self.inner.devices.lock() {
      guard.insert(device_id, status);
    }
  }

  fn current_status(&self) -> MqttStatus {
    self
      .inner
      .status
      .lock()
      .map(|guard| guard.clone())
      .unwrap_or_default()
  }

  fn snapshot(&self) -> Value {
    let status = self.current_status();
    let devices = self
      .inner
      .devices
      .lock()
      .map(|guard| guard.clone())
      .unwrap_or_default();
    json!({
      "status": status.status,
      "message": status.message,
      "devices": devices
    })
  }
}

pub fn start_mqtt_bridge(app: AppHandle, state: MqttState) {
  publish_status(&app, &state, "connecting", None);

  tauri::async_runtime::spawn(async move {
    let client_id = format!(
      "harmony_kasir_tauri_{}",
      &uuid::Uuid::new_v4().to_string().replace('-', "")[..8]
    );

    let mut options = MqttOptions::new(client_id, BROKER_HOST, BROKER_PORT);
    options.set_credentials(MQTT_USERNAME, MQTT_PASSWORD);
    options.set_keep_alive(Duration::from_secs(60));
    options.set_clean_session(true);

    let (client, mut eventloop) = AsyncClient::new(options, 32);
    publish_status(&app, &state, "connecting", None);

    loop {
      match eventloop.poll().await {
        Ok(Event::Incoming(Incoming::ConnAck(_))) => {
          publish_status(&app, &state, "connected", None);
          for topic in MQTT_TOPICS {
            if let Err(err) = client.subscribe(topic, QoS::AtMostOnce).await {
              publish_status(
                &app,
                &state,
                "error",
                Some(format!("Subscribe gagal {}: {}", topic, err)),
              );
            }
          }
        }
        Ok(Event::Incoming(Incoming::Publish(msg))) => {
          handle_publish(&app, &state, &msg.topic, &msg.payload);
        }
        Ok(Event::Incoming(Incoming::Disconnect)) => {
          publish_status(&app, &state, "disconnected", None);
        }
        Ok(_) => {}
        Err(err) => {
          publish_status(&app, &state, "error", Some(err.to_string()));
          publish_status(&app, &state, "disconnected", None);
        }
      }
    }
  });
}

fn publish_status(app: &AppHandle, state: &MqttState, status: &str, message: Option<String>) {
  state.set_status(status, message.clone());
  let payload = json!({
    "status": status,
    "message": message
  });
  let _ = app.emit("mqtt-status", payload);
}

fn handle_publish(app: &AppHandle, state: &MqttState, topic: &str, payload: &[u8]) {
  let raw = String::from_utf8_lossy(payload).trim().to_string();

  if topic.starts_with("harmony/rfid/") && topic.ends_with("/status") {
    let parts: Vec<&str> = topic.split('/').collect();
    if parts.len() >= 4 {
      let device_id = parts[2].to_string();
      let status = raw.clone();
      state.set_device_status(device_id.clone(), status.clone());
      let _ = app.emit(
        "rfid-device-status",
        json!({
          "device_id": device_id,
          "status": status
        }),
      );
    }
    return;
  }

  let parsed: Value = match serde_json::from_str(&raw) {
    Ok(value) => value,
    Err(_) => return,
  };

  let schema = parsed.get("schema").and_then(Value::as_str).unwrap_or_default();
  let event = parsed.get("event").and_then(Value::as_str).unwrap_or_default();
  if schema != "rfid.v1" || event != "scan" {
    return;
  }

  let uid = parsed
    .get("uid")
    .and_then(Value::as_str)
    .map(|u| u.trim().to_uppercase());
  let Some(uid) = uid else {
    return;
  };

  let scan_payload = json!({
    "uid": uid,
    "device_id": parsed.get("device_id").and_then(Value::as_str).unwrap_or("unknown"),
    "uid_len": parsed.get("uid_len").and_then(Value::as_u64),
    "ts_ms": parsed.get("ts_ms").and_then(Value::as_u64)
  });

  let _ = app.emit("rfid-uid", uid);
  let _ = app.emit("rfid-scan-data", scan_payload);
}
