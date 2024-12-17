import React from 'react';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Content = () => (
  <div className="next-steps my-5" data-testid="content">
    <h2 className="my-5 text-center" data-testid="content-title">
      Kasety jak za starych dobrych lat!
    </h2>
    <Row className="d-flex justify-content-between" data-testid="content-items">
      <p>
        <b>VTS</b> czyli Video Tape Shop.
        W czasie cyfrowej dominacji nadal są ludzie, którzy chcą oglądać filmy na kasetach.
        Idąc na przeciw naszym klientom doceniającym klasykę stworzyliśmy aplikację, która pozwala na wypożyczanie kaset wideo.
      </p>
      <p>
        <b>Wypożyczanie</b> jest bardzo proste. Wystarczy zarejestrować się w aplikacji, wybrać interesującą nas kasetę i wypożyczyć.
        Wypożyczenie jest darmowe, a czas wypożyczenia to 7 dni.
      </p>
      <p>
        <b>Wypożyczone</b> kasety można oddać w każdej chwili, a jeśli chcemy je zatrzymać na dłużej, to wystarczy przedłużyć wypożyczenie.
        Przedłużenie jest również darmowe i nie ma ograniczeń co do ilości przedłużeń.
      </p>
    </Row>
  </div>
);

export default Content;
