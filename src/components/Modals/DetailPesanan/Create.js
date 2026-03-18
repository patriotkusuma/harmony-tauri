import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, FormGroup, Input, Label, Modal } from 'reactstrap'
import axios from '../../../services/axios-instance';

const Create = props => {
    const {toggleModal, isOpen, kodePesan, filteredData, onSubmitSuccess} = props
    const [authToken, setAuthToken] = useState(localStorage.getItem('token')||null);
    const [nama, setNama] =useState();
    const [jumlah, setJumlah] = useState();
    const [data, setData] = useState({
        id:"",
        kodePesan: "",
        nama: "",
        jumlah: ""
    })

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setData((prevProps) => ({
            ...prevProps,
            [name] : value
        }))
    }
    const headers = {
        'Authorization' : `Bearer ${authToken}`
    }

    useEffect(()=>{
        setData({
            'id' : filteredData != null ? filteredData.id: '',
            'kodePesan': kodePesan != null ? kodePesan : '',
            'nama' : filteredData != null ? filteredData.nama_pakaian : '',
            'jumlah' : filteredData != null ? filteredData.jumlah : ''
        })
    }, [filteredData]);

    const submit =  async(e) => {
        try{
            if(filteredData == null){
                await axios.post('/pakaian',{
                    nama: data.nama,
                    kodePesan: data.kodePesan,
                    jumlah: data.jumlah
                }, {headers}).catch((err) => console.log(err))
            }else{
                await axios.post(`/pakaian/${data.id}`, {
                    id:data.id,
                    nama: data.nama,
                    kodePesan:data.kodePesan,
                    jumlah: data.jumlah,
                    _method: 'patch'
                },{headers}).catch((err) => console.log(err));
            }

            onSubmitSuccess()
            

            return toggleModal()
        }catch(err){
            console.log(err);
        }
    }

  return (
    <Modal
        className='modal-dialog-centerd modal-md'
        toggle={toggleModal}
        autoFocus={false}
        isOpen={isOpen}
    >
        <div className='modal-header'>
            <h2 className='modal-title' id='modal-title-default'>
                {filteredData != null ? "Edit":"Tambah"} Detail Pakaian
            </h2>
            <button
                aria-label='close'
                auto-dismiss="modal"
                type='button'
                onClick={toggleModal}
                className='close'
            >
                <span aria-hidden={true}>
                    <i className='fa-solid fa-xmark'></i>
                </span>

            </button>
        </div>

        <div className='modal-body'>
            <Form role='form'>
                <FormGroup>
                    <Label className='form-control-label'>Nama</Label>
                    <Input
                        autoFocus={true}
                        className='form-control-alternative'
                        name='nama'
                        id='nama'
                        type='text'
                        defaultValue={filteredData !=null ? filteredData.nama_pakaian : ''}
                        onChange={handleInputChange}
                        placeholder='Nama Pakaian'
                    />
                </FormGroup>

                <FormGroup>
                    <Label className='form-control-label'>Jumlah</Label>
                    <Input
                        className='form-control-alternative'
                        name='jumlah'
                        id='deskripsi'
                        defaultValue={filteredData != null ? filteredData.jumlah : 0}
                        onChange={handleInputChange}
                        type='number'
                        min={0}
                    />
                </FormGroup>
            </Form>
        </div>

        <div className='modal-footer'>
            <Button
                className='mr-auto'
                color='link'
                data-dismiss="modal"
                type='button'
                onClick={toggleModal}
            >
                Close
            </Button>
            <Button
                color='primary'
                size='md'
                type='button'
                onClick={submit}
            >
                <i className='fa-regular fa-floppy-disk'></i>
                <span>Simpan</span>
            </Button>
        </div>

    </Modal>
  )
}

Create.propTypes = {
    toggleModal: PropTypes.func,
    isOpen: PropTypes.bool,
    filteredData:PropTypes.array,
    kodePesan: PropTypes.string,
    onSubmitSuccess: PropTypes.func,
}

export default Create