import Body from '../Body/Body'

const FolderPage: React.FC<{ folderName: string }> = ({ folderName }) => {
  return (
    <Body>
      <h1>Вы находитесь в папке "{folderName}"</h1>
    </Body>
  )
}

export default FolderPage
