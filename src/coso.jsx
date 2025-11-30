import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, SimpleGrid, Group, Title, Button } from '@mantine/core';
import AstroHeader from './components/BlogHeader';
import PolaroidCard from './components/PolaroidCard';
import NewPostModal from './components/NewPostModal';
import DiaryInput from './components/DiaryInput';
import DiaryList from './components/DiaryList';

// URL Base de tu API
const API_URL = 'http://127.0.0.1:8000/api';

function AstroPhotoBlogApp() {
  const [posts, setPosts] = useState([]);
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // ------------------------------------------------------
  // 1. CARGA INICIAL DE DATOS (Posts y Notas)
  // ------------------------------------------------------
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Hacemos las dos peticiones en paralelo
      const [postsRes, notesRes] = await Promise.all([
        axios.get(`${API_URL}/posts`),
        axios.get(`${API_URL}/notes`) // Asegúrate de haber creado esta ruta en Laravel
      ]);
      
      setPosts(postsRes.data);
      setNotes(notesRes.data);
    } catch (error) {
      console.error("Error conectando con el servidor:", error);
    }
  };

  // ------------------------------------------------------
  // 2. LÓGICA DE POSTS (Fotos)
  // ------------------------------------------------------
  const handleAddPost = async (newPostData) => {
    try {
      const response = await axios.post(`${API_URL}/posts`, newPostData);
      setPosts([response.data, ...posts]);
      setModalOpen(false);
    } catch (error) {
      console.error("Error creando post:", error);
      alert("Error al guardar la foto.");
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres borrar este recuerdo?")) return;
    try {
      await axios.delete(`${API_URL}/posts/${id}`);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error eliminando post:", error);
      alert("No se pudo eliminar.");
    }
  };

  const handleEditPost = async (updatedPost) => {
    try {
      await axios.put(`${API_URL}/posts/${updatedPost.id}`, updatedPost);
      setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
      setEditModalOpen(false);
      setEditingPost(null);
    } catch (error) {
      console.error("Error editando post:", error);
      alert("Error al editar.");
    }
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setEditModalOpen(true);
  };

  // ------------------------------------------------------
  // 3. LÓGICA DE NOTAS (Diario)
  // ------------------------------------------------------
  const handleAddNote = async (noteInput) => {
    try {
      // Verificamos si noteInput es un string o un objeto
      const textToSend = noteInput.text || noteInput.content || noteInput;
      
      const response = await axios.post(`${API_URL}/notes`, { content: textToSend });
      setNotes([response.data, ...notes]);
    } catch (error) {
      console.error("Error guardando nota:", error);
      alert("No se pudo guardar la nota en el servidor.");
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      setNotes(notes.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error borrando nota:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'url(https://img.freepik.com/vector-gratis/notas-rasgadas-vector-fondo-melocoton_53876-109024.jpg) center/cover no-repeat fixed',
        paddingTop: 90,
        paddingBottom: 40,
        boxSizing: 'border-box',
      }}
    >
      <AstroHeader />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20, background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))', borderRadius: 12 }}>
        <Container size="lg" style={{ maxWidth: 1200 }}>
          <Group position="apart" mb="xl">
            <Title order={2} style={{ color: '#fafafaff', fontWeight: 600, letterSpacing: 1, textShadow: '0 2px 8px #222' }}>
              Explora y comparte tus momentos
            </Title>
            <Button
              size="md" variant="light" color="white" radius="md"
              onClick={() => setModalOpen(true)}
              style={{ fontWeight: 600 }}
            >
              + Nueva foto
            </Button>
          </Group>

          {/* Grid de Fotos */}
          <SimpleGrid
            cols={3} spacing="xl"
            breakpoints={[
              { maxWidth: 900, cols: 2, spacing: 'lg' },
              { maxWidth: 600, cols: 1, spacing: 'md' },
            ]}
          >
            {posts.map(post => (
              <PolaroidCard
                key={post.id}
                post={post}
                onEdit={() => openEditModal(post)}
                onDelete={() => handleDeletePost(post.id)}
              />
            ))}
          </SimpleGrid>
        </Container>
      </div>

      {/* Modales */}
      <NewPostModal 
        opened={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onAdd={handleAddPost} 
      />

      <NewPostModal
        opened={editModalOpen}
        onClose={() => { setEditModalOpen(false); setEditingPost(null); }}
        onAdd={handleEditPost}
        initialData={editingPost}
        isEdit
      />

      {/* Sección Diario */}
      <div style={{ maxWidth: 1200, margin: '24px auto 60px' }}>
        <DiaryInput onAdd={handleAddNote} />
        <DiaryList notes={notes} onDelete={handleDeleteNote} />
      </div>
    </div>
  );
}

export default AstroPhotoBlogApp;