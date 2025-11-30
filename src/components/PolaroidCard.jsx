

import { Card, Image, Text, Group, Button } from '@mantine/core';

function PolaroidCard({ post, onEdit, onDelete }) {
  return (
    <Card
      shadow="lg"
      padding="xs"
      style={{
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 18,
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        border: '1px solid rgba(255,255,255,0.6)',
        minHeight: 370,
        maxWidth: 320,
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 18px 40px rgba(0,0,0,0.22)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
    >
      <Image
        src={post.image}
        alt={post.title}
        height={220}
        radius="md"
        style={{
          objectFit: 'cover',
          width: '100%',
          borderRadius: 12,
          marginBottom: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)'
        }}
        withPlaceholder
      />
      <Text weight={700} size="lg" align="center" style={{ marginBottom: 6, fontFamily: 'cursive', color: '#222222' }}>{post.title}</Text>
      <Text size="sm" align="center" style={{ marginBottom: 10, minHeight: 38, color: '#444444' }}>
        {post.description}
      </Text>
      <Group position="apart" style={{ width: '100%' }} mt="xs">
        <Button size="xs" color="blue" variant="light" onClick={onEdit} style={{ flex: 1, marginRight: 8, borderRadius: 8 }}>Editar</Button>
        <Button size="xs" color="red" variant="light" onClick={onDelete} style={{ flex: 1, marginLeft: 8, borderRadius: 8 }}>Eliminar</Button>
      </Group>
    </Card>
  );
}

export default PolaroidCard;
