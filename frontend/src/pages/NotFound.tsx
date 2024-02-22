import { Illustration } from '@assets/Illustration'
import classes from '@components/module_css/NotFound.module.css'
import { Button, Container, Group, Text, Title } from '@mantine/core'
import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
interface NotFoundProps {}

const NotFound: FunctionComponent<NotFoundProps> = () => {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Страница не найдена</Title>
          <Text
            c='dimmed'
            size='lg'
            ta='center'
            className={classes.description}
          >
            Страница, которую вы пытаетесь открыть, не существует. Возможно, вы
            неправильно ввели адрес или страница была удаленна.
          </Text>
          <Group justify='center'>
            <Link to='/'>
              <Button
                className='bg-blue-500 text-white hover:bg-blue-600'
                size='md'
              >
                Вернуться на главную
              </Button>
            </Link>
          </Group>
        </div>
      </div>
    </Container>
  )
}

export default NotFound
