import React, { FC } from 'react';
import { GetServerSideProps } from 'next';

type Props = {
  userRole: string;
};

const Bookings: FC<Props> = ({ userRole }) => {
  if (userRole !== 'admin') {
    return <p>Not authorized</p>;
  }
  return (
    <div>
      <h1>Bookings</h1>
    </div>
  );
};
export default Bookings;

export const getServerSideProps: GetServerSideProps = async context => {
  const token = context.req.cookies.token;

  const response = await fetch('http://api:4200/auth/account', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();

  return { props: { userRole: data.role ? data.role : 'user' } };
};
