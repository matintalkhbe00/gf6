import fetch from 'node-fetch';

let totalRewards = 0; // جمع کل جوایز در سطح کل برنامه

async function action(headers: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch(
      "https://dev-api.goatsbot.xyz/missions/action/66db47e2ff88e4527783327e",
      {
        method: "POST",
        headers,
      }
    );

    return res.ok; // اگر درخواست موفق بود، true برمی‌گرداند
  } catch (error) {
    console.error('Error in action:', error);
    return false;
  }
}

async function getNextTime(headers: Record<string, string>): Promise<number> {
  try {
    const res = await fetch("https://api-mission.goatsbot.xyz/missions/user", {
      headers,
    });

    if (!res.ok) {
      console.error(`Get missions request failed: ${res.status} ${res.statusText}`);
      const now = Math.floor(Date.now() / 1000);
      return now + 60; // زمان پیش‌فرض
    }

    const data = await res.json();
    return data["SPECIAL MISSION"][0]["next_time_execute"];
  } catch (error) {
    console.error('Error in getNextTime:', error);
    const now = Math.floor(Date.now() / 1000);
    return now + 60; // زمان پیش‌فرض
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleToken(authToken: string, tokenNumber: number): Promise<void> {
  const headers: Record<string, string> = { Authorization: `Bearer ${authToken}` };
  let nextTime = await getNextTime(headers);
  let rewardsCount = 0; // شمارش جوایز برای هر توکن

  while (true) {
    const now = Math.floor(Date.now() / 1000);

    if (now >= nextTime) {
      const result = await action(headers);
      if (result) {
        rewardsCount += 200; // هر بار که عمل موفقیت‌آمیز باشد، 200 به شمارش جوایز اضافه می‌شود
        totalRewards += 200; // به جمع کل جوایز اضافه می‌شود
        console.log(`Success: Action to earn was successfully completed for token number ${tokenNumber}.`);
        console.log(`Total rewards for token number ${tokenNumber}: ${rewardsCount}`);
        console.log(`Total rewards accumulated: ${totalRewards}`);
        nextTime = await getNextTime(headers);
        console.log(`Success: Got new nextTime for token number ${tokenNumber}: ${nextTime}`);
      } else {
        console.log(`Failed: Action to earn failed for token number ${tokenNumber}`);
      }
    }

    // زمان باقی‌مانده تا اجرای بعدی محاسبه می‌شود
    const waitTime = Math.max(nextTime - now, 1); // حداقل 1 ثانیه تاخیر
    await delay(waitTime * 1000); // تبدیل به میلی‌ثانیه
  }
}

async function makeMoney(tokensAndNumbers: { token: string, number: number }[]): Promise<void> {
  const promises = tokensAndNumbers.map(({ token, number }) => handleToken(token, number));
  await Promise.all(promises);
}

// لیستی از توکن‌ها و شماره‌های مرتبط با آن‌ها
const tokensAndNumbers = [
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZjQ0MmU1MDIzMDkwNjNkODkwNzJmIiwiaWF0IjoxNzI4MzI0NDY0LCJleHAiOjE3Mjg0MTA4NjQsInR5cGUiOiJhY2Nlc3MifQ.DdkHHi_FsOXL1w7UWRA0XiwVF4tfLL5OQung5n1IPL0" , number:1 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTAzZDk1NGI2OTAxNzgwMDk5ZWE5IiwiaWF0IjoxNzI4MzI0NTA5LCJleHAiOjE3Mjg0MTA5MDksInR5cGUiOiJhY2Nlc3MifQ.1l4VsgPFLJFviTxUOnD760OyuXQsiYv10B2Lx1I6B4w" , number:2 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA0NWMxMjM0Y2ZkYTZlZDc5Yjk5IiwiaWF0IjoxNzI4MzIzNzA1LCJleHAiOjE3Mjg0MTAxMDUsInR5cGUiOiJhY2Nlc3MifQ.WGEiNP3DNlQ-BwEm7_h5DzVP7PVk-PPOiQbNa1ocumM" , number:3 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA0ZTEyYTgxMGEwYjQ1OGJjMjI1IiwiaWF0IjoxNzI4MzI0MDU3LCJleHAiOjE3Mjg0MTA0NTcsInR5cGUiOiJhY2Nlc3MifQ.-nKra6ciu1GYq6b43FR_OR7Ovcu3kBxiFuFquzg6XZA" , number:4 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA2NWEyYTgxMGEwYjQ1OGQ0NWU0IiwiaWF0IjoxNzI4MzI0MjU2LCJleHAiOjE3Mjg0MTA2NTYsInR5cGUiOiJhY2Nlc3MifQ.J9Hr0TR0JfPSloxDdw3uIMSMn7XpuadBuLJX1vPzQ5I" , number:5 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZjQzNTc1MDIzMDkwNjNkODc4YzRhIiwiaWF0IjoxNzI4MzI0MzcwLCJleHAiOjE3Mjg0MTA3NzAsInR5cGUiOiJhY2Nlc3MifQ.gvUpxhNUuxIJMSlhSI8yk-ZyTWiuNMbi0nGd_BmGAxE" , number:6 },

];


makeMoney(tokensAndNumbers);

console.log("Executed: Started...");
