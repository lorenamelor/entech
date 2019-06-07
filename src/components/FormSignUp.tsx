import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { IRootState } from '../store';
import { IUser } from '../utils/interfaces';
import { userCreate } from '../store/user';
import { selectIsCreateUser, selectSignUpSuccess } from '../store/user';

const validationForm = Yup.object().shape({
  name: Yup.string()
    .required("Campo obrigatório"),
  email: Yup.string()
    .email("Email inválido")
    .required("Email é obrigatório"),
  password: Yup.string()
    .required("Senha é obrigatório")
    .matches(/[a-zA-Z]/, 'Deve conter letras')
    .matches(/[0-9]/, 'Deve conter números'),
  confirmPassword: Yup.string()
    .required("Confirmar senha é obrigatório")
    .oneOf([Yup.ref("confirmPassword")], "As senhas não conferem")
});

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}
class FormSignUp extends React.PureComponent<IMapDispatchToProps & IMapStateToProps> {
  public render() {

    const { isCreateUser, signUpSuccess } = this.props;

    if(signUpSuccess) { return <Redirect to="/" /> }
    return (
      <Wrapper>
            <Title>JUNTE-SE À COMUNIDADE</Title>

            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={validationForm}
              onSubmit={values => {
                const payload = {
                  ...values,
                  type: "participant",
                }
                this.props.userCreate(payload);
              }}
            >
              {({ errors, touched, values: {
                name,
                email,
                password,
                confirmPassword,
              },
                handleChange, setFieldTouched }) => {

                const change = (nameInput: any, e: any) => {
                  e.persist();
                  handleChange(e);
                  setFieldTouched(nameInput, true, false);
                };

                return (
                  <Form>
                    <Input
                      label="Nome completo"
                      name='name'
                      value={name}
                      helperText={touched.name ? errors.name : ""}
                      error={touched.name && Boolean(errors.name)}
                      onChange={change.bind(null, "name")}
                      width="99%"
                    />

                    <Input
                      label="Email"
                      name='email'
                      value={email}
                      helperText={touched.email ? errors.email : ""}
                      error={touched.email && Boolean(errors.email)}
                      onChange={change.bind(null, "email")}
                      width="99%"
                    />

                    <Input
                      label="Senha"
                      name='password'
                      value={password}
                      helperText={touched.password ? errors.password : ""}
                      error={touched.password && Boolean(errors.password)}
                      onChange={change.bind(null, "password")}
                      type="password"
                      width="99%"
                    />

                    <Input
                      label="Confirmar Senha"
                      name='confirmPassword'
                      value={confirmPassword}
                      helperText={touched.confirmPassword ? errors.confirmPassword : ""}
                      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                      onChange={change.bind(null, "confirmPassword")}
                      type="password"
                      width="99%"
                    />

                    <Btn type="submit">{isCreateUser ? <Spinner size={20}/>: 'Salvar'}</Btn>
                    <Btn oauth>
                      Continuar com o <Image src={require("../assets/imgs/meetup-logo.png")}/>
                    </Btn>
                  </Form>
                )
              }}
            </Formik>
      </Wrapper >
    );
  }
}

// MAP TO PROPS
interface IMapStateToProps {
  isCreateUser: boolean;
  signUpSuccess: boolean;
};

const mapStateToProps = (state: IRootState): IMapStateToProps => ({
  isCreateUser: selectIsCreateUser(state),
  signUpSuccess: selectSignUpSuccess(state),
});

interface IMapDispatchToProps {
 userCreate: (payload: IUser) => void;
}

const mapDispatchToProps = (dispatch: Dispatch): IMapDispatchToProps => ({
 userCreate: (payload: IUser) => dispatch(userCreate.started(payload)),
})


// STYLE
const Wrapper = styled.div`
    width: 360px;
    margin-right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Input: any = styled(TextField)<{ width: string }>`
&&{
  margin: 5px;
  width: ${props => props.width};
}
` as typeof TextField;

const Btn: any = styled(Button)<{ oauth?: boolean }>`
&&{
  margin-top: 20px;
  width: 100%;
  background-color: ${props => props.oauth ? '#ED1C40' : props.theme.colors.primary};
  color: ${props => props.theme.colors.white}
}

&:hover {
  background-color: ${props => props.oauth ? '#ED1C40' : props.theme.colors.primary} !important;
  opacity: 1;
}
` as typeof Button;

const Image = styled.img`
  width: 70px;
  height: 25px;
  margin-left: 6px;
 `;

const Title = styled.h1`
    color: ${props => props.theme.colors.primary};
    font-size: 35px;
    margin: 2px;
    font-family: monospace !important;
    align-self: flex-start;
`;

const Spinner = styled(CircularProgress)`
&&{
	color: ${props => props.theme.colors.white};;
}
` as typeof CircularProgress;
export default connect(mapStateToProps, mapDispatchToProps)(FormSignUp);
