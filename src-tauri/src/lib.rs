use tauri::Manager;

mod mqtt;
mod printer;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .on_page_load(|webview, payload| {
      println!(
        "[tauri:on_page_load] window={} url={}",
        webview.label(),
        payload.url()
      );
    })
    .manage(mqtt::MqttState::default())
    .invoke_handler(tauri::generate_handler![
      printer::print_order,
      printer::print_raw,
      printer::print_last_order,
      printer::print_name,
      mqtt::mqtt_get_status
    ])
    .setup(|app| {
      let mqtt_state = app.state::<mqtt::MqttState>().inner().clone();
      mqtt::start_mqtt_bridge(app.handle().clone(), mqtt_state);

      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
