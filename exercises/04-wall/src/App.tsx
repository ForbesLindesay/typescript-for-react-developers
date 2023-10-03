import React from 'react';
import './App.css';
import NewPost from './NewPost';
import Post from './types';

const App: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <NewPost onSubmit={(newPost) => setPosts([newPost, ...posts])} />
        {posts.map((post): React.ReactNode => {
          switch (post.kind) {
            case 'text':
              return <p key={post.id}>{post.body}</p>;
            case 'image':
              return (
                <img key={post.id} src={post.src} alt="User Uploaded File" />
              );
          }
        })}
      </header>
    </div>
  );
};

export default App;
