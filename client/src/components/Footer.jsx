import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
    const currentYear = new Date().getFullYear();

  return (
    <footer>
        <Container>
            <Row>
                <Col className="text-center py-3">
                    <p>Gr8life Ecommerce Shop {currentYear}</p>
                    <p>Coded by <a href="https://russellramiro.netlify.app/" target="_blank" rel="noreferrer">Russell Ramiro</a> &copy; 2023</p>
                </Col>
            </Row>
        </Container>
    </footer>
  )
}

export default Footer;