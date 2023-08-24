import { api } from '@/services/api'
import { withAuth } from '@/services/authUtils'
import { getAPIClient } from '@/services/axios'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'


export default function Dashboard() {
  useEffect(() => {
    api.get('/profile/list')
  })

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <h1>LOGADO PORRA!</h1>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = withAuth(async (ctx) => {
  const api = getAPIClient(ctx)

  // api.get('/profile/list')
  // Aqui você pode fazer qualquer lógica específica da página
  return {
    props: {},
  };
});