import notfoundreal from './Assets/not-found-real.webp';

const NotFoundPage = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <img src={notfoundreal} alt="404 Not Found" style={{ maxWidth: '100%', height: 'auto' }} />
        <h1 style={{ marginLeft: '200px' }}></h1>
      </div>
    );
 };
 
export default NotFoundPage;
