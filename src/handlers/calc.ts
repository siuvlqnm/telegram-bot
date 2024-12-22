import { sendMessage } from '@/utils/telegram';

function calculate(expression: string): number | string {
 try {
    // 移除空格
    const sanitizedExpression = expression.replace(/\s/g, '');

    const [num1Str, operator, num2Str] = sanitizedExpression.split(/([+\-*/])/);

      if(!num1Str || !operator || !num2Str) {
          return "无效的算式";
      }
      const num1 = Number(num1Str);
       const num2 = Number(num2Str);
       if(isNaN(num1) || isNaN(num2)) {
         return "无效的数字";
       }


     switch (operator) {
        case '+':
           return num1 + num2;
        case '-':
           return num1 - num2;
        case '*':
           return num1 * num2;
        case '/':
           if (num2 === 0) {
               return "除零错误";
           }
           return num1 / num2;
        default:
           return "无效的运算符";
      }
   } catch (error) {
      console.error("计算错误:", error);
      return "计算错误，请检查算式";
   }
}

 export async function handleCalcCommand(chatId: number, text: string) {
     const result = calculate(text);
     await sendMessage(chatId, `🧮 结果是: ${result}`);
 }