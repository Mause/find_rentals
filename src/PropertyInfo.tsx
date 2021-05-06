import { faSquareFull, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, parseISO } from 'date-fns';
import React, { useState } from 'react';
import {
  Notification,
  Modal,
  Card,
  Button,
  Table,
} from 'react-bulma-components';
import { Property, StatusMapping } from './types';

export function PropertyInfo({
  property,
  statusMapping,
}: {
  property: Property;
  statusMapping?: StatusMapping;
}) {
  const [show, setShow] = useState(false);

  const style = (statusMapping || {})[property.RealStatus];

  return (
    <>
      <Modal show={show} onClose={() => setShow(false)}>
        <Modal.Card>
          <Modal.Card.Header>
            <Modal.Card.Title>{property.Address}</Modal.Card.Title>
          </Modal.Card.Header>
          <Card.Image
            alt="this is a house"
            src={
              property.listing?.mainImage ||
              'https://s3-ap-southeast-2.amazonaws.com/rea-placeholder-assets/placeholder.png'
            }
          />
          <Modal.Card.Body>
            <Table size="fullwidth" striped>
              <tbody>
                <tr>
                  <th>Viewed</th>
                  <td>{property['Viewed?']}</td>
                  <th>Applied</th>
                  <td>{property['Applied?']}</td>
                </tr>
                <tr>
                  <th>Concerns</th>
                  <td>{property['Concerns']}</td>
                  <th>Good things</th>
                  <td>{property['Good things']}</td>
                </tr>
                <tr>
                  <th>Beds</th>
                  <td>{property.listing?.bedrooms || property.Beds}</td>
                  <th>Bathrooms</th>
                  <td>{property.listing?.bathrooms}</td>
                </tr>
                <tr>
                  <th>Parking spaces</th>
                  <td>{property.listing?.parkingSpaces}</td>
                  <th>Agency</th>
                  <td>{property.listing?.agencyName}</td>
                </tr>
                <tr>
                  <th>Application system</th>
                  <td>{property.system}</td>
                  <th>Application system status</th>
                  <td>{property.applicationStatus}</td>
                </tr>
                <tr>
                  <th>Available</th>
                  <td>
                    {property.Available
                      ? format(parseISO(property.Available), 'dd/mm/yyy')
                      : 'unknown'}
                  </td>
                </tr>
              </tbody>
            </Table>
            {!property.listing && (
              <Notification color="info">
                Listing has been removed?
              </Notification>
            )}
          </Modal.Card.Body>
          <Modal.Card.Footer>
            {style ? (
              <FontAwesomeIcon icon={faSquareFull} style={JSON.parse(style)} />
            ) : null}
            &nbsp;
            {property.RealStatus}
          </Modal.Card.Footer>
        </Modal.Card>
      </Modal>
      <Button onClick={() => setShow(true)} color="ghost">
        <FontAwesomeIcon icon={faInfoCircle} />
      </Button>
    </>
  );
}
