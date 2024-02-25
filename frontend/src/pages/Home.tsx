import Body from '@components/Body/Body'
import { Grid, Skeleton } from '@mantine/core'
import { FunctionComponent } from 'react'

interface HomeProps {}
const child = <Skeleton height={140} width='auto' radius='md' animate={false} />

const Home: FunctionComponent<HomeProps> = () => {
  return (
    <Body>
      <div className='m-5'>
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 'auto' }}>
            {child}
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 'auto' }}>
            {child}
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 'auto' }}>
            {child}
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 'auto' }}>
            {child}
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 'auto' }}>
            {child}
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 'auto' }}>
            {child}
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 'auto' }}>
            {child}
          </Grid.Col>
        </Grid>
      </div>
    </Body>
  )
}

export default Home
