import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import Loader from '../components/ui/Loader';
import './UIKit.css';

export default function UIKit() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('tashkent');

  return (
    <section className="cc-ui-kit">
      <h2>Cherry Cake — UI Kit</h2>

      <Card title="Buttons">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button onClick={() => setToast('Button clicked!')}>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
      </Card>

      <Card title="Inputs">
        <div style={{ display: 'grid', gap: 16 }}>
          <Input
            label="Your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your name"
          />
          <Input label="Email" error="Invalid email" placeholder="Enter email" />
          <Input label="Disabled input" disabled placeholder="Unavailable" />
        </div>
      </Card>

      <Card title="Select">
        <Select
          label="Choose your region"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          options={[
            { value: 'tashkent', label: 'Tashkent' },
            { value: 'samarkand', label: 'Samarkand' },
            { value: 'bukhara', label: 'Bukhara' },
          ]}
        />
      </Card>

      <Card title="Modal">
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Cherry Cake Modal"
        >
          <p>This is a reusable modal component.</p>
        </Modal>
      </Card>

      <Card title="Toast">
        <Button onClick={() => setToast('Success notification!')}>
          Show Toast
        </Button>
      </Card>

      <Card title="Loader">
        <Loader />
      </Card>

      <Toast
        message={toast}
        type="success"
        onClose={() => setToast('')}
      />
    </section>
  );
}
