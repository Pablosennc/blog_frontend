import { useState } from 'react';
import { Textarea, Button, Group, TextInput } from '@mantine/core';

function DiaryInput({ onAdd }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleAdd = () => {
    if (!title && !content) return;
    onAdd({ id: Date.now(), title: title || 'Nota rápida', content, date: new Date().toISOString() });
    setTitle('');
    setContent('');
  };

  return (
    <div style={{ marginTop: 32, marginBottom: 24, background: 'rgba(255,255,255,0.9)', padding: 16, borderRadius: 12, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
      <Textarea placeholder="Escribe tu entrada de diario aquí..." value={content} onChange={e => setContent(e.target.value)} autosize minRows={3} maxRows={6} mb="sm" />
      <Group position="right">
        <Button onClick={handleAdd} variant="gradient" gradient={{ from: 'teal', to: 'lime' }}>Agregar nota</Button>
      </Group>
    </div>
  );
}

export default DiaryInput;
