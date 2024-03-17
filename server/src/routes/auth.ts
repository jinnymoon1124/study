import { Request, Response, Router } from 'express';
import User from '../entities/User';
import { isEmpty, validate } from 'class-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const mapError = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];

    return prev;
  }, {});
};

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  console.log('email', email);

  try {
    let errors: any = {};

    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    if (emailUser) errors.email = '이미 사용중인 이메일';
    if (usernameUser) errors.username = '이미 사용중인 사용자 이름';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    // 엔티티에 걸어둔 조건으로 데이터 유효성 검사
    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(mapError(errors));

    // 유저 정보를 테이블에 저장
    await user.save();
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};

    if (isEmpty(username)) errors.username = '사용자 이름은 비워둘 수 없음';
    if (isEmpty(password)) errors.password = '비밀번호는 비워둘 수 없음';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // DB가서 사용자 정보 있는지 확인
    const user = await User.findOneBy({ username });

    if (!user)
      return res.status(404).json({ username: '사용자 이름이 등록되지 않음' });

    // 비번 비교해보기
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ password: '비밀번호 오류' });
    }

    // 비밀번호까지 다 맞으면 토큰 생성
    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    res.set('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
       maxAge: 60 * 60 * 24 * 7,
       path: "/"
    }));

    return res.json({user, token})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};

const router = Router();
router.post('/register', register);
router.post('/login', login);

export default router;
