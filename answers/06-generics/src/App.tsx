import React from 'react';
import './App.css';
import NewPost from './NewPost';
import Post from './types';
import List from './List';

const App: React.FC = () => {
  const [posts, setPosts] = React.useState<readonly Post[]>([]);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <NewPost onSubmit={(newPost) => setPosts([newPost, ...posts])} />
        <List
          items={posts}
          renderItem={(post): React.ReactNode => {
            switch (post.kind) {
              case 'text':
                return <p key={post.id}>{post.body}</p>;
              case 'image':
                return <img key={post.id} src={post.src} />;
            }
          }}
        />
      </header>
    </div>
  );
};

export default App;
