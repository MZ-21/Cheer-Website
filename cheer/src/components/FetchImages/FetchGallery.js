import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FetchImage.css'

const domainName = window.location.origin.split(':')[1].slice(2);
const backendUrl = `http://${domainName}:8080`; // The backend URL
const routerPath = '/api';

const FetchImagesComponent = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${backendUrl}${routerPath}/fetchImages`);
                setImages(response.data.images);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='bodyOfGallery'>
           <h1 className='titleCheer'>Cheer's Gallery</h1>
           <h3 className='subtitleCheer'>Capturing the moment</h3>
            <div className="image-grid">
                {images.map(image => (
                    <div key={image._id} className="image-item">
                        <img src={image.baseUrl} alt={image.filename} className="image" />
                        <p className="image-caption">{image.filename}</p>
                     
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FetchImagesComponent;


//{"_id":{"$oid":"6607737977d3947e18f1af3f"},"baseUrl":"https://lh3.googleusercontent.com/lr/AAJ1LKc-DvcVYn456aHaCvjptyfxBqoYXD7qzWkM9R8q4WoBaXe6wROZ11IrnnOiGhV7Ut2mcj8o3NVV5nu4NswLpuaMtW53HC7wkfNFiyjFiTDH0vTvRMTas5KlD6j6pA3A0DIKIeTs-PfNZXU2jis67CNEyHn8Xgq04G4bPzuV3QmExLHsIx4s09W8ypzEkv4d7T1uDTpEGDEs3IT0PYV4zukdeuYrzSicI4nSgaP7X_M2Sfxvb-oUHt6s-5oDR-XJRn6GezUd1Qx7I4SvVyWSmN5l3gbd4qcN2zQbkozJ-0nG0Xwdy6s1U7AxkjGuFCgKtD4FjcgpZqQpjAlQLIrdPrRA0bwsV4BulEQSU_yE93jjmCczVv33dVcXLOi0ExJGb9mb4y7RiMkyvX6Dey_RtMhTS6Ep5f6D9vXcj_G7cGhUE01JCJ42y2nshHhwzPNRp8dpAh0jSH5zDDfsS_GfN5S9LiKbI-Jh7JeQbIqWOCA1VxrWgcAjnRaGCkHeLJZOqVF6EQ7qAGVvmQ7lcNuiKrFJUsD712XEton4TdXYj1syvEI4nX3DXE5ZyStAxUXxf2-eAGoaKIUtng47-KGdpn8Y8D2wP7RdnjUeUN1J7E4tVwX3R4y6727XOhCuLj7hkVHyApeEDdwDxAd0yZgMy9lULIuG97pm3JYXvFD-HSa7x_Ek3HKoiGy_vNnY1tvlJ4um19F2V70aPwIYD3p3Ci7FWFqxUUsHdLb86fgmDNPJP8qfQbJfZgrboxh2fMM2A_1EbmPcbGWobfE2g7uXDbFJNX4kh5Ogr3r7UlS6lZX_bEbKVJW6vTDv9YdcygmiGYyHQ8wPCSGRKxNlTanE8zO7uXkrf-YbTnzE7lrfcxWNc3AgGbvu8xHdWkPDRVWJEtun4tvRFs3d55_9iRS_JeJWY9hDJF2WsK-zIQwgeSGpXcUOWFcDZCTXqqAHnLHvCt43hOEBPGwEY1oGVqyizsiSjag_tQ","filename":"20220730_095018.jpg","imageId":"AO4MJzF2eOWd8wHOxgjQOKnNS2Je1a9b_AZ3IhDehiVu7ipaYRTrwufj5__qRAJUd8rAUFMwaQOjuzHekHswJ2insUlhphJ6DA","mimeType":"image/jpeg","productUrl":"https://photos.google.com/lr/photo/AO4MJzF2eOWd8wHOxgjQOKnNS2Je1a9b_AZ3IhDehiVu7ipaYRTrwufj5__qRAJUd8rAUFMwaQOjuzHekHswJ2insUlhphJ6DA","__v":{"$numberInt":"0"}}