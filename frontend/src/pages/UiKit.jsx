import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/uiSlice';
import apiClient from '../api/client';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Checkbox from '../components/ui/Checkbox';
import Radio, { RadioGroup } from '../components/ui/Radio';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';
import Table from '../components/ui/Table';
import EmptyState, { ErrorState } from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';

export function UiKit() {
  const dispatch = useDispatch();

  // State controls for testing components
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('uz');
  const [checkedBox, setCheckedBox] = useState(true);
  const [radioVal, setRadioVal] = useState('one');
  const [modalOpen, setModalOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // Trigger simulated API error to prove CC-11 error toast works
  const triggerApiError = () => {
    // Calling non-existent endpoint or invalid payload through apiClient
    apiClient.get('/non-existent-trigger-error-toast')
      .catch(() => {
        // Interceptor in api/client automatically catches and dispatches toast!
      });
  };

  const sampleColumns = [
    { key: 'name', title: 'Название' },
    { key: 'category', title: 'Категория' },
    { key: 'price', title: 'Цена' }
  ];

  const sampleRows = [
    { id: 1, name: 'Вишнёвый круассан', category: 'Выпечка', price: '25 000 UZS' },
    { id: 2, name: 'Макарон Сакура', category: 'Десерты', price: '18 000 UZS' }
  ];

  return (
    <div className="container" style={{ padding: 'var(--space-6) var(--space-4)' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-primary)', fontSize: 'var(--font-size-2xl)' }}>
          Витрина UI-кита (Design System Showcase)
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Все обязательные состояния компонентов: default, hover, focus-visible (кольцо 2px), disabled, loading, error
        </p>
      </div>

      {/* 1. BUTTONS */}
      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
          1. Кнопки (Button)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              Варианты (primary, secondary, ghost)
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <Button variant="primary">Primary Default</Button>
              <Button variant="secondary">Secondary Default</Button>
              <Button variant="ghost">Ghost Default</Button>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              Размеры (sm, md, lg)
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              Состояния: Disabled & Loading
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              <Button variant="primary" disabled>Primary Disabled</Button>
              <Button variant="secondary" disabled>Secondary Disabled</Button>
              <Button variant="primary" loading={btnLoading} onClick={() => { setBtnLoading(true); setTimeout(() => setBtnLoading(false), 2000); }}>
                {btnLoading ? 'Загрузка...' : 'Кликни для Loading (2с)'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INPUTS */}
      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
          2. Поля ввода (Input)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          <Input
            label="Имя пользователя"
            hint="Введите ваше полное имя"
            placeholder="Иван Иванов"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Input
            label="Обязательное поле с ошибкой"
            required
            error="Это поле обязательно для заполнения"
            value=""
            onChange={() => {}}
          />
          <Input
            label="Заблокированное поле (Disabled)"
            disabled
            value="Только для чтения"
            onChange={() => {}}
          />
        </div>
      </section>

      {/* 3. SELECTS */}
      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
          3. Выпадающие списки (Select)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          <Select
            label="Выбор страны"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            options={[
              { value: 'uz', label: '🇺🇿 Узбекистан (UZS)' },
              { value: 'kz', label: '🇰🇿 Казахстан (KZT)' },
              { value: 'ru', label: '🇷🇺 Россия (RUB)' }
            ]}
          />
          <Select
            label="Селект с ошибкой"
            error="Пожалуйста, выберите значение"
            options={[{ value: '', label: '— Выберите опцию —' }]}
          />
          <Select
            label="Заблокированный селект"
            disabled
            options={[{ value: 'fixed', label: 'Фиксированное значение' }]}
          />
        </div>
      </section>

      {/* 4. CHECKBOX & RADIO */}
      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
          4. Чекбоксы и радиокнопки (Checkbox & Radio)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Чекбоксы</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Checkbox label="Активный чекбокс" checked={checkedBox} onChange={(e) => setCheckedBox(e.target.checked)} />
              <Checkbox label="Неактивный чекбокс" checked={false} onChange={() => {}} />
              <Checkbox label="Заблокированный чекбокс" disabled checked={true} onChange={() => {}} />
            </div>
          </div>
          <div>
            <RadioGroup label="Группа радиокнопок">
              <Radio name="demoRadio" value="one" label="Опция 1 (Активна)" checked={radioVal === 'one'} onChange={() => setRadioVal('one')} />
              <Radio name="demoRadio" value="two" label="Опция 2" checked={radioVal === 'two'} onChange={() => setRadioVal('two')} />
              <Radio name="demoRadio" value="three" label="Опция 3 (Disabled)" disabled checked={false} onChange={() => {}} />
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* 5. CARDS & BADGES */}
      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
          5. Карточки (Card) и бейджи (Badge)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          <Card>
            <h4 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Обычная карточка</h4>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>Статический контейнер контента.</p>
          </Card>
          <Card onClick={() => dispatch(showToast({ type: 'info', message: 'Клик по интерактивной карточке!' }))}>
            <h4 style={{ color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>Кликабельная карточка (Hover)</h4>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>Кликните, чтобы проверить интерактивность.</p>
          </Card>
          <Card disabled>
            <h4 style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>Заблокированная карточка</h4>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>Opacity: 0.6.</p>
          </Card>
        </div>
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">В наличии</Badge>
          <Badge variant="error">Ошибка</Badge>
          <Badge variant="warning">Внимание</Badge>
          <Badge count={5} />
        </div>
      </section>

      {/* 6. MODAL & TOASTS & API FAILURE */}
      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
          6. Модальное окно, Тосты и Проверка сбоя API (CC-11 & CC-12)
        </h2>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Открыть Modal (Esc / Focus Trap)
          </Button>
          <Button variant="secondary" onClick={() => dispatch(showToast({ type: 'success', message: 'Успешное действие!' }))}>
            Тост: Успех
          </Button>
          <Button variant="secondary" onClick={() => dispatch(showToast({ type: 'error', message: 'Ошибка валидации!' }))}>
            Тост: Ошибка
          </Button>
          <Button variant="ghost" onClick={triggerApiError} style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>
            ⚠️ Проверить сбой API (CC-11: авто-выброс тоста)
          </Button>
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Тестовое модальное окно">
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
            Модальное окно захватывает фокус, закрывается по клавише Escape или по клику на оверлей, и возвращает фокус на кнопку вызова.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Отмена</Button>
            <Button variant="primary" onClick={() => { setModalOpen(false); dispatch(showToast({ type: 'success', message: 'Подтверждено в модалке' })); }}>
              Понятно
            </Button>
          </div>
        </Modal>
      </section>

      {/* 7. LOADERS, TABLES & STATES */}
      <section style={{ marginBottom: 'var(--space-7)' }}>
        <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
          7. Таблица, лоадер и состояния пустых данных (Table, Loader, EmptyState)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span>Лоадеры:</span>
            <Loader size="sm" />
            <Loader size="md" />
            <Loader size="lg" />
          </div>

          <h3 style={{ fontSize: 'var(--font-size-md)', marginTop: 'var(--space-2)' }}>Таблица с данными (горизонтальный скролл на 320px)</h3>
          <Table columns={sampleColumns} rows={sampleRows} />

          <h3 style={{ fontSize: 'var(--font-size-md)', marginTop: 'var(--space-2)' }}>Таблица в состоянии загрузки</h3>
          <Table columns={sampleColumns} rows={[]} loading={true} />

          <h3 style={{ fontSize: 'var(--font-size-md)', marginTop: 'var(--space-2)' }}>Компоненты EmptyState и ErrorState</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            <Card>
              <EmptyState title="Корзина пуста" text="Добавьте десерты из каталога." actionText="В каталог" onAction={() => {}} />
            </Card>
            <Card>
              <ErrorState title="Сервер недоступен" text="Проверьте соединение с сетью." actionText="Повторить" onAction={() => {}} />
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UiKit;
