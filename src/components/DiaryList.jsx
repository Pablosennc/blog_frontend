import { Card, Text, Group, Button } from '@mantine/core';

function DiaryList({ notes, onDelete }) {
  if (!notes || notes.length === 0) return <div style={{ marginTop: 16 }}><Text style={{ color: '#333333' }}>No hay notas aún.</Text></div>;

  return (
    <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
      {notes.map(n => (
        <Card key={n.id} padding="sm" shadow="sm" style={{ background: 'rgba(255,255,255,0.94)' }}>
          <Group position="apart">
            <div>
              <Text weight={700} style={{ color: '#222222' }}>{n.title}</Text>
              <Text size="xs" style={{ color: '#666666' }}>{new Date(n.date).toLocaleString()}</Text>
            </div>
            <Button size="xs" color="red" variant="light" onClick={() => onDelete(n.id)}>Borrar</Button>
          </Group>
          <Text size="sm" style={{ marginTop: 8, whiteSpace: 'pre-wrap', color: '#222222' }}>{n.content}</Text>
        </Card>
      ))}
    </div>
  );
}

export default DiaryList;
