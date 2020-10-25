import { Container } from "@material-ui/core";

const MainLayout = (props) => {
  const { children } = props;
  return (
    <Container maxWidth='lg'>
      { children }
    </Container>
  );
};

export default MainLayout;