import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async () => {
    return {
      redirect: {
        destination: `/stories/story01`,
        permanent: true
      }
    }
}
export default function Home() {
    return null
}