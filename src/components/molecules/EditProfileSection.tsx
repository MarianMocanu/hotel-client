import { ChangeEvent, FC, useState, FormEvent, FocusEvent, useContext, useEffect } from 'react';
import styles from '@/styles/EditProfileSection.module.css';
import { Context, User } from '../atoms/Context';
import Input from '../atoms/Input';
import Filler from '../atoms/Filler';
import Button from '../atoms/Button';
import { toast } from 'react-toastify';
import { editUser } from '@/app/authAPI';
import { format } from 'date-fns';

type InputData = {
  value: string;
  valid: boolean;
  blurred: boolean;
};

type Form = {
  name: InputData;
  email: InputData;
  phone: InputData;
  address: InputData;
  dob: InputData;
};

type Props = {
  isEditionEnabled: boolean;
  setEditionEnabled: any;
};
export const EditProfileSection: FC<Props> = ({ isEditionEnabled, setEditionEnabled }) => {
  const { user, setUser, setError } = useContext(Context);
  const [form, setForm] = useState<Form>({
    name: { value: '', valid: false, blurred: false },
    email: { value: '', valid: false, blurred: false },
    phone: { value: '', valid: false, blurred: false },
    address: { value: '', valid: true, blurred: false },
    dob: { value: '', valid: true, blurred: false },
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
      case 'address':
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
        address: { value: user.address ? user.address : '', valid: true, blurred: false },
        dob: {
          value: user.dob ? format(new Date(user.dob), 'yyyy-MM-dd') : '',
          valid: true,
          blurred: false,
        },
      });
    }
  }, []);

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();
    const editedUser: User = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      address: form.address.value,
      dob: form.dob.value,
    };

    if (user._id && isUserValid()) {
      try {
        const response = await editUser(user._id, editedUser);
        if (response && response.ok) {
          const data = await response.json();
          if (data) {
            toast.success('Your profile was edited successfully!');
            setUser(prevUser => ({
              ...data,
              bookings: prevUser.bookings,
            }));
          } else {
            throw new Error('Error parsing response');
          }
        } else {
          throw new Error('Error. Please try again.');
        }
      } catch (error) {
        console.error(error);
        setError({
          message:
            'We could not change your profile. Make sure the information provided is correct.',
          shouldRefresh: true,
        });
      } finally {
        setEditionEnabled(false);
      }
    } else {
      setError({
        message: 'The information provided is not valid and needs to be modified',
        shouldRefresh: true,
      });
    }
  }

  function handleCancelEdition(): void {
    setEditionEnabled(false);
  }

  function isUserValid(): boolean {
    if (
      form.name &&
      form.name.valid &&
      user.phone &&
      form.phone.valid &&
      user.email &&
      form.email.valid
    ) {
      return true;
    }
    return false;
  }

  return (
    <div className={styles.footer}>
      <form className={styles.form}>
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
        <Input
          value={form.address.value}
          onChange={handleChange}
          onBlur={validateOnBlur}
          placeholder="Address"
          showError={form.address.blurred ? !form.address.valid : false}
          name="address"
          type="text"
        />
        <Input
          value={form.dob.value}
          onChange={handleChange}
          onBlur={validateOnBlur}
          placeholder="Date of Birth"
          showError={false}
          name="dob"
          type="date"
        />
        <Filler />
        <div className={styles.grid}>
          <Button onClick={handleCancelEdition} text="Cancel" secondary />
          <Button onClick={handleSubmit} text="Save Changes" />
        </div>
      </form>
    </div>
  );
};
