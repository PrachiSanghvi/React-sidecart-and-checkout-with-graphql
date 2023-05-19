import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardText, CardBody, CardTitle, Col, Input } from 'reactstrap';

const ProductCard = ({ title, productType, src, id, product, isVariant, index, varianntIds, setVariantIds }) => {


  return (
    <Col sm="3" className="pt-4" id={index}>
      <Card height={100}>
        <CardImg bottom width="100%" src={src} />

        <CardBody>
          <CardTitle>{isVariant ? "Price : " : null}{productType}</CardTitle>
          <CardText >{isVariant ? "Size : " : null}{title}</CardText>

          {isVariant ? null : <CardText><Link to={`/products/${id}`} state={{ product: product }}>View product</Link></CardText>}
        </CardBody>

      </Card>
    </Col>
  );
};

export default ProductCard;