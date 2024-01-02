import React, { FC, useContext, useState, useEffect, FocusEvent, ChangeEvent } from 'react';
import Input from '../atoms/Input';
import { Context } from '../atoms/Context';

type InputData = {
  value: string;
  valid: boolean;
  blurred: boolean;
};

type Form = {
  name: InputData;
  email: InputData;
  phone: InputData;
  corporation: InputData;
  comments: InputData;
};

type Props = {
  isEvent: boolean;
};

const GuestForm: FC<Props> = ({ isEvent }) => {
  const { booking, setBooking, user, eventBooking, setEventBooking } = useContext(Context);
  const [form, setForm] = useState<Form>({
    name: { value: '', valid: false, blurred: false },
    email: { value: '', valid: false, blurred: false },
    phone: { value: '', valid: false, blurred: false },
    corporation: { value: '', valid: true, blurred: false },
    comments: { value: '', valid: true, blurred: false },
  });

  function validateOnBlur(event: FocusEvent<HTMLInputElement>): void {
    const name = event.target.name as keyof Form;
    const formState: Form = JSON.parse(JSON.stringify(form));
    formState[name].valid = validateInput(name, formState[name].value);
    formState[name].blurred = true;
    setForm(formState);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const name = event.target.name as keyof Form;
    const formState: Form = JSON.parse(JSON.stringify(form));
    formState[name].value = event.target.value;
    setForm(formState);
  }

  function validateInput(name: keyof Form, value: string): boolean {
    switch (name) {
      case 'name':
        return value.length >= 5;
      case 'email':
        return /^.+@.+..+$/.test(value);
      case 'phone':
        return value.length === 8;
      default:
        return false;
    }
  }

  useEffect(() => {
    if (user.email && user.name && user.phone) {
      setForm({
        name: { value: user.name, valid: true, blurred: false },
        email: { value: user.email, valid: true, blurred: false },
        phone: { value: user.phone, valid: true, blurred: false },
        corporation: { value: '', valid: true, blurred: false },
        comments: { value: '', valid: true, blurred: false },
      });
    }
  }, []);

  useEffect(() => {
    if (form.name.valid && form.email.valid && form.phone.valid) {
      if (isEvent) {
        setEventBooking({
          ...eventBooking,
          host_name: form.name.value,
          email: form.email.value,
          phone: form.phone.value,
          corporation: form.corporation.value,
          comments: form.comments.value,
        });
      } else {
        const newGuest = {
          name: form.name.value,
          email: form.email.value,
          phone: form.phone.value,
          numberOfGuests: booking.guest.numberOfGuests,
          guestsString: booking.guest.guestsString,
        };
        setBooking({ ...booking, guest: newGuest });
      }
    }
  }, [form]);

  return (
    <form style={{ flex: 1, paddingRight: '1rem' }}>
      <Input
        name="name"
        onBlur={validateOnBlur}
        onChange={handleChange}
        placeholder="Full name"
        value={form.name.value}
        showError={form.name.blurred && !form.name.valid}
        type="text"
      />
      <Input
        name="email"
        onBlur={validateOnBlur}
        onChange={handleChange}
        placeholder="Email"
        value={form.email.value}
        showError={form.email.blurred && !form.email.valid}
        type="email"
      />
      <Input
        value={form.phone.value}
        onChange={handleChange}
        onBlur={validateOnBlur}
        placeholder="Phone"
        showError={form.phone.blurred ? !form.phone.valid : false}
        name="phone"
        type="text"
      />
      {isEvent && (
        <>
          {eventBooking.type === 'meeting' && (
            <Input
              value={form.corporation.value}
              onChange={handleChange}
              onBlur={validateOnBlur}
              placeholder="Corporation"
              showError={false}
              name="corporation"
              type="text"
            />
          )}
          <Input
            value={form.comments.value}
            onChange={handleChange}
            onBlur={validateOnBlur}
            placeholder="Comments"
            showError={false}
            name="comments"
            type="text"
          />
        </>
      )}
    </form>
  );
};
export default GuestForm;
