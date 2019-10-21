import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';

import { cropImage } from '../../utils/crop-image';
import Avatar from '../avatar';
import Modal from '../modal';

import styles from './avatar-upload.module.scss';

interface IAvatarUploadProps {
  current: string;
  userName: string;
  onSetAvatar: (avatarUrl: string) => void;
}

const AvatarUpload: React.FC<IAvatarUploadProps> = ({ current, userName, onSetAvatar }) => {
  const [image, setImage] = useState();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState();
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedPixels(croppedAreaPixels);
  }, []);
  const onFileChange = useCallback(async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const imageDataUrl = await readFile(e.target.files[0]);
      setImage(imageDataUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  }, []);

  const closeModal = () => setImage(undefined);

  const getImage = async () => {
    try {
      const croppedImage = await cropImage(
        image,
        croppedPixels,
      );

      if (croppedImage) {
        closeModal();
        onSetAvatar(croppedImage);
      }
    } catch (e) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  };

  return (
    <div>
      <div className={styles.avatar}>
        <Avatar size={80} src={current} text={userName} />
        <input type="file" onChange={onFileChange} />
        <strong>
          Upload
        </strong>
      </div>

      {image && (
        <Modal
          title="Set profile photo"
          close={closeModal}
          width={400}
        >
          <div>
            <div className="crop-container" style={{ position: 'relative', width: '100%', height: 300 }}>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          </div>

          <footer>
            <button className="pt-button m-r-10" onClick={closeModal}>Cancel</button>
            <button className="pt-button pt-intent-success" onClick={getImage}>Crop avatar</button>
          </footer>
        </Modal>
      )}
    </div>
  );
};

function readFile(file: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default AvatarUpload;
