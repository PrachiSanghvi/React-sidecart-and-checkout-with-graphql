import React from 'react';
import { Card, Button, CardText, Col, Label, Input, FormGroup } from 'reactstrap';

const AddressCard = ({
    id,
    address1,
    address2,
    city,
    company,
    country,
    province,
    zip,
    isDefault,
    onRemove,
    setEditData,
    toggle,
    setDefaultAddress,
    removeLoader }) => {  

    return (
        <Col sm="3">
            <Card body>
                {/* <CardTitle class="text-uppercase">{isDefault && "Default address"}</CardTitle> */}
                <CardText>{address1} {address2}</CardText>
                <CardText>{city} {province} {country}</CardText>
                <CardText>{company} {zip}</CardText>
                <FormGroup check>
                    <Label check>
                        <Input type="radio" name="address" value={id} checked={isDefault} onClick={()=>setDefaultAddress(id)} />Default address
                    </Label>
                </FormGroup>
                <div>
                    <Button onClick={() => {
                        setEditData({
                            id,
                            address1,
                            address2,
                            city,
                            company,
                            country,
                            province,
                            zip,
                        });
                        toggle();
                    }}>Edit</Button> <Button onClick={() => onRemove(id)}>Remove</Button>
                </div>

            </Card>
        </Col>
    );
};

export default AddressCard;