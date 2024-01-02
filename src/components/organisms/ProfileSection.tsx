import React, { FC, useContext, useState, MouseEvent } from 'react';
import { Booking, Context, User } from '../atoms/Context';
import { differenceInDays, format } from 'date-fns';
import { EditProfileSection } from '../molecules/EditProfileSection';
import styles from '@/styles/EditProfileSection.module.css';
import Button from '../atoms/Button';
import Image from 'next/image';
import { FaCalendarAlt, FaMoon, FaUser, FaUserFriends } from 'react-icons/fa';

function ProfileSection() {
  const { user, setUser } = useContext(Context);
  const [tab, setTab] = useState<'profile' | 'bookings'>('profile');
  const [isEditionEnabled, setEditionEnabled] = useState<boolean>(false);

  function handleOnTabClick(event: MouseEvent): void {
    const tab = event.currentTarget.id;
    if (tab) {
      setTab(tab as 'profile' | 'bookings');
    }
  }

  function handleProfileEdition(): void {
    setEditionEnabled(true);
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>My Dashboard</h3>
      <div className={styles.grid}>
        <div className={styles.menu}>
          <p
            id="profile"
            onClick={handleOnTabClick}
            className={tab === 'profile' ? styles.selected : ''}
          >
            Profile
          </p>
          <p
            id="bookings"
            onClick={handleOnTabClick}
            className={tab !== 'profile' ? styles.selected : ''}
          >
            My Bookings
          </p>
        </div>
        <div className={styles.content}>
          {tab === 'profile' ? (
            <>
              <div className={styles.flex}>
                <h3 className={styles.subtitle}>Profile</h3>
                {!isEditionEnabled && (
                  <Button onClick={handleProfileEdition} text="Edit Profile" secondary />
                )}
              </div>
              {!isEditionEnabled ? (
                <div>
                  {Object.keys(user).map(key => {
                    const userKey = key as keyof User;
                    if (userKey !== '_id' && userKey !== 'bookings') {
                      if (userKey === 'dob' && typeof user[userKey] === 'string') {
                        const dob = format(new Date(user[userKey] as string), 'dd/MM/yyyy');
                        return (
                          <div className={styles.userFieldContainer} key={key}>
                            <p className={styles.userField}>Date of Birth</p>
                            <p className={styles.userFieldData}>{dob}</p>
                          </div>
                        );
                      } else {
                        return (
                          <div className={styles.userFieldContainer} key={key}>
                            <p className={styles.userField}>{userKey}</p>
                            <p className={styles.userFieldData}>{user[userKey]}</p>
                          </div>
                        );
                      }
                    }
                    return null;
                  })}
                </div>
              ) : (
                <div>
                  <EditProfileSection
                    isEditionEnabled={isEditionEnabled}
                    setEditionEnabled={setEditionEnabled}
                  />
                </div>
                //edit profile page
              )}
            </>
          ) : (
            <div>
              <h3 className={styles.subtitle}>My Bookings</h3>
              <div className={styles.bookingsContainer}>
                {user?.bookings === undefined ? (
                  <p>You don't have any booking yet.</p>
                ) : (
                  user.bookings?.map(booking => <BookingCard booking={booking} />)
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProfileSection;

type BookingCardProps = {
  booking: Booking;
};
const BookingCard: FC<BookingCardProps> = ({ booking }) => {
  return (
    <div className={styles.bookingCard}>
      <Image
        src={`/rooms/double.webp`}
        alt="room"
        height={113}
        width={185}
        className={styles.picture}
      />
      <div className={styles.cardContent}>
        <div>
          <p className={styles.cardtitle}>Booking Nr</p>
          <p>{booking._id && booking._id.slice(-6)}</p>
        </div>
        <div>
          <FaCalendarAlt className={styles.icon} />
          <p>
            {booking.checkout &&
              `${format(new Date(booking.checkout), 'dd/MM/yyyy')} - ${format(
                new Date(booking.checkout),
                'dd/MM/yyyy',
              )}`}
          </p>
        </div>
        <div>
          <FaMoon className={styles.icon} />
          <p>
            {booking.checkin && booking.checkout
              ? differenceInDays(new Date(booking.checkout), new Date(booking.checkin))
              : 'N/A'}{' '}
            Nights
          </p>
        </div>
        <div>
          {booking.guest.numberOfGuests && booking.guest.numberOfGuests > 1 ? (
            <>
              <FaUserFriends className={styles.icon} />
              <p>{booking.guest.numberOfGuests} Guests </p>
            </>
          ) : (
            <>
              <FaUser className={styles.icon} />
              <p>{booking.guest.numberOfGuests} Guest</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
