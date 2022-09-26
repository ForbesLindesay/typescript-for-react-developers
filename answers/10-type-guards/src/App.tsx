import React from 'react';
import assertNever from 'assert-never';
import './App.css';
import NewPost from './NewPost';
import Post, {isImagePost, isTextPost} from './types';

const App: React.FC = () => {
  const [posts, setPosts] = React.useState<readonly Post[]>([]);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <NewPost onSubmit={(newPost) => setPosts([newPost, ...posts])} />
        {posts.map((post): React.ReactNode => {
          if (isTextPost(post)) {
            return <p key={post.id}>{post.body}</p>;
          }
          if (isImagePost(post)) {
            return <img key={post.id} src={post.src} alt="User Uploaded File" />;
          }
          return assertNever(post);
        })}
      </header>
    </div>
  );
};

export default App;
