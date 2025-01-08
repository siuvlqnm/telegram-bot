// import axios from 'axios';
// import { Context } from 'hono';

// interface Res {
//     data: {
//       word_list: {
//         sentence_id: string
//         word: string
//         event_time: string
//         hot_value: string
//       }[]
//     }
// }
  
// //   export default defineSource(async () => {
// //     const url = "https://www.douyin.com/aweme/v1/web/hot/search/list/?device_platform=webapp&aid=6383&channel=channel_pc_web&detail_list=1"
// //     const cookie = (await $fetch.raw("https://www.douyin.com/passport/general/login_guiding_strategy/?aid=6383")).headers.getSetCookie()
// //     const res: Res = await myFetch(url, {
// //       headers: {
// //         cookie: cookie.join("; "),
// //       },
// //     })
// //     return res.data.word_list.map((k) => {
// //       return {
// //         id: k.sentence_id,
// //         title: k.word,
// //         url: `https://www.douyin.com/hot/${k.sentence_id}`,
// //       }
// //     })
// //   })

// export class DouyinService {
//     async getHotSearch() {
//         const url = "https://www.douyin.com/aweme/v1/web/hot/search/list/?device_platform=webapp&aid=6383&channel=channel_pc_web&detail_list=1";

//         const response = await axios.get('https://www.douyin.com/passport/general/login_guiding_strategy/?aid=6383');
    
//         // 2. 提取 Set-Cookie 头并拼接成一个字符串
//         const setCookieHeaders = response.headers['set-cookie'];
//         console.log('set-cookie:',response.headers['set-cookie']);
//         if (setCookieHeaders && setCookieHeaders.length > 0) {
//           const cookieString = setCookieHeaders.join('; ');
          
//           // 3. 使用拼接后的 cookie 字符串进行下一个请求
//           const res = await axios.get(url, {
//             headers: {
//               Cookie: cookieString,
//             },
//           });
//           console.log(res.data);

//             const data: Res = res.data;

//             // 处理并返回数据
//             const result = data.data.word_list.map((k) => {
//                 return {
//                 id: k.sentence_id,
//                 title: k.word,
//                 url: `https://www.douyin.com/hot/${k.sentence_id}`,
//                 };
//             });

//             console.log(result);
//             return result;
//         }
//     }
// }