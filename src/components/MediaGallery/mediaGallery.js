// components/MediaGallery.js
import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const MediaGallery = ({ mediaType }) => {
  const [mediaFiles, setMediaFiles] = useState([]);

  useEffect(() => {
    // Определяем папку в зависимости от типа медиа
    const folder = mediaType === 'photo' ? 'photos' : 'videos';
    
    // Создаем контекст для автоматического импорта файлов
    const context = require.context(
      `../../public/${folder}`, // Путь к папке
      false, // Не искать в подпапках
      /\.(jpg|jpeg|png|gif|mp4)$/ // Поддерживаемые форматы
    );

    // Получаем список файлов
    const files = context.keys().map(context);
    setMediaFiles(files);
  }, [mediaType]);

  return (
    <Container fluid className="gallery-container">
      <Row xs={1} md={2} lg={3} className="g-4">
        {mediaFiles.map((file, index) => (
          <Col key={index}>
            <Card className="media-card">
              {mediaType === 'photo' ? (
                <Card.Img 
                  variant="top" 
                  src={file.default} // Для изображений
                  alt={`${mediaType}-${index}`}
                  className="gallery-image"
                />
              ) : (
                <video controls className="gallery-video">
                  <source src={file.default} type="video/mp4" />
                  Ваш браузер не поддерживает видео
                </video>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MediaGallery;