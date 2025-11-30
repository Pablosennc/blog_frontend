import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, SimpleGrid, Group, Title, Button } from '@mantine/core';
import AstroHeader from './components/BlogHeader';
import PolaroidCard from './components/PolaroidCard';
import NewPostModal from './components/NewPostModal';
import DiaryInput from './components/DiaryInput';
import DiaryList from './components/DiaryList';


// Si despliegas a producción, cambia esto por la URL de Koyeb/Railway
const API_URL = 'https://ruling-vida-blopa-5afe5dca.koyeb.app/api';

function AstroPhotoBlogApp() {
  const [posts, setPosts] = useState([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [notes, setNotes] = useState([]);


  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const [postsRes, notesRes] = await Promise.all([
        axios.get(`${API_URL}/posts`),
        axios.get(`${API_URL}/notes`)
      ]);
      
      const postsData = postsRes.data && postsRes.data.data ? postsRes.data.data : postsRes.data;
      const notesData = notesRes.data && notesRes.data.data ? notesRes.data.data : notesRes.data;

      console.log("Lo que llegó de Laravel (posts):", postsData);
      console.log("Lo que llegó de Laravel (notes):", notesData);

      setPosts(Array.isArray(postsData) ? postsData : []);
      setNotes(Array.isArray(notesData) ? notesData : []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };


  const handleAddPost = async (newPostData) => {
    try {
      const response = await axios.post(API_URL, newPostData);
      const created = response.data && response.data.data ? response.data.data : response.data;
      setPosts([created, ...posts]);
      setModalOpen(false);
    } catch (error) {
      console.error("Error creando post:", error);
      alert("Error al guardar. Revisa que el servidor Laravel esté activo (puerto 8000) y la URL de la imagen sea válida.");
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres borrar este recuerdo?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error("Error eliminando post:", error);
      alert("No se pudo eliminar el post. Verifica la conexión con el servidor.");
    }
  };
  
  const openEditModal = (post) => {
    setEditingPost(post);
    setEditModalOpen(true);
  };

  const handleEditPost = async (updatedPostData) => {
    try {
      await axios.put(`${API_URL}/${updatedPostData.id}`, updatedPostData);
      setPosts(posts.map(post => post.id === updatedPostData.id ? updatedPostData : post));
      setEditingPost(null);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error actualizando post:", error);
      alert("Error al actualizar el post.");
    }
  };

  const handleAddNote = async (noteInput) => {
    try {
      const textToSend = noteInput && (noteInput.text || noteInput.content) ? (noteInput.text || noteInput.content) : noteInput;
      const res = await axios.post(`${API_URL}/notes`, { content: textToSend });
      const note = res.data && res.data.data ? res.data.data : res.data;
      setNotes([note, ...notes]);
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
      alert("No se pudo borrar la nota.");
    }
  };


  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'url([https://img.freepik.com/vector-gratis/notas-rasgadas-vector-fondo-melocoton_53876-109024.jpg](https://img.freepik.com/vector-gratis/notas-rasgadas-vector-fondo-melocoton_53876-109024.jpg)) center/cover no-repeat fixed',
        paddingTop: 90,
        paddingBottom: 40,
        boxSizing: 'border-box',
      }}
    >

      <AstroHeader />
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20, background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))', borderRadius: 12 }}>
        <Container size="lg" style={{ maxWidth: 1200 }}>
          <Group position="apart" mb="xl">
            <Title order={2} style={{ color: '#222222', fontWeight: 600, letterSpacing: 1, textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>
              Explora y comparte tus momentos
            </Title>
            <Button
              size="md"
              variant="filled"
              color="indigo"
              radius={"md "}
              onClick={() => setModalOpen(true)}
              style={{ fontWeight: 700 }}
            >
              + Nueva foto
            </Button>
          </Group>


          {posts.length === 0 && (
            <div style={{ textAlign: 'center', color: '#222222', padding: 40 }}>
              <p style={{ fontSize: '1.2rem', marginBottom: 10, color: '#333333' }}>No hay recuerdos guardados aún.</p>
              <small style={{ color: '#555555' }}>.</small>
            </div>
          )}

          <SimpleGrid
            cols={3}
            spacing="xl"
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

      
      <NewPostModal 
        opened={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onAdd={handleAddPost} 
      />

      <div style={{ maxWidth: 1200, margin: '24px auto 60px' }}>
        <DiaryInput onAdd={handleAddNote} />
        <DiaryList notes={notes} onDelete={handleDeleteNote} />
      </div>

      <NewPostModal
        opened={editModalOpen}
        onClose={() => { setEditModalOpen(false); setEditingPost(null); }}
        onAdd={handleEditPost}
        initialData={editingPost}
        isEdit
      />
    </div>
  );
}

export default AstroPhotoBlogApp;
