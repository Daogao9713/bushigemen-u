import suzumiyaPic from '../assets/images/alumni/suzumiya.jpg';
import hanzhiPic from '../assets/images/alumni/hanzhi_m.jpg';
import defaultAvatar from '../assets/images/alumni/logo.jpg';
import usamiharuPic from '../assets/images/alumni/usamiharu.jpg';

export const alumniList = [
  {
    id: 1,
    name: "SUZUMIYA GAO",
    major: "University President",
    quote: "I founded this place because I didn't want to study.",
    avatar: suzumiyaPic, // 注意：不要加引号
    tags: ["Founder", "顶级的校长"],
  },
  {
    id: 2,
    name: "Hanzhi M",
    major: "二次元婆罗门",
    quote: "‘I AM YOUR FATHER",
    avatar: hanzhiPic,
    tags: ["人类", "本校有名学生", "高官奖学金获得者"],
  },
  {
    id: 3,
    name: "JASON TAO",
    major: "Department of Gaming",
    quote: "I CAN DO THIS ALL DAY",
    avatar: defaultAvatar,
    tags: ["传奇", "高官奖学金获得者"],
  },
  {
    id: 4,
    name: "USAMI HARU",
    major: "勇者",
    quote: "必ず魔王を倒す！！",
    avatar: usamiharuPic,
    tags: ["本校最强勇者", "高官奖学金获得者"],
  },
];