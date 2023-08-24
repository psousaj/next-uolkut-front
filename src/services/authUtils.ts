import { parseCookies } from 'nookies';
import { GetServerSideProps } from 'next';

export const withAuth = (
  callback: GetServerSideProps
): GetServerSideProps => async (ctx) => {
  const { ['uolkut.access_token']: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return callback(ctx);
};
