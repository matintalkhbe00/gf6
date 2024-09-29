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
      return now + 10; // زمان پیش‌فرض
    }

    const data = await res.json();
    return data["SPECIAL MISSION"][0]["next_time_execute"];
  } catch (error) {
    console.error('Error in getNextTime:', error);
    const now = Math.floor(Date.now() / 1000);
    return now + 10; // زمان پیش‌فرض
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

    await delay(1000);
  }
}

async function makeMoney(tokensAndNumbers: { token: string, number: number }[]): Promise<void> {
  const promises = tokensAndNumbers.map(({ token, number }) => handleToken(token, number));
  await Promise.all(promises);
}

// لیستی از توکن‌ها و شماره‌های مرتبط با آن‌ها
const tokensAndNumbers = [
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZjQ0MmU1MDIzMDkwNjNkODkwNzJmIiwiaWF0IjoxNzI3NjM0MTU0LCJleHAiOjE3Mjc3MjA1NTQsInR5cGUiOiJhY2Nlc3MifQ.64yqwppVTi3G2u_d-Z1I34GCnLKEmru-5cK2P8vi4BM", number:1 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA0NWMxMjM0Y2ZkYTZlZDc5Yjk5IiwiaWF0IjoxNzI3NjM1Mjc5LCJleHAiOjE3Mjc3MjE2NzksInR5cGUiOiJhY2Nlc3MifQ.1BxU8cUyQhCS70oZfxj0Dy_-S-Wdm6J33HoD8HdESbQ", number:2 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA0ZTEyYTgxMGEwYjQ1OGJjMjI1IiwiaWF0IjoxNzI3NjM1NDU0LCJleHAiOjE3Mjc3MjE4NTQsInR5cGUiOiJhY2Nlc3MifQ.bOTiYBZlGdkFf8z1s8nmQ6w1pUDSbler3MMoaeeJCWY", number:3 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA2NWEyYTgxMGEwYjQ1OGQ0NWU0IiwiaWF0IjoxNzI3NjM2MzUyLCJleHAiOjE3Mjc3MjI3NTIsInR5cGUiOiJhY2Nlc3MifQ.slYK92rm2iEC7ZJJAulVT4M5MBKdwvcARpTQNkGmNao", number:4 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZjQzNTc1MDIzMDkwNjNkODc4YzRhIiwiaWF0IjoxNzI3NjM2NDI0LCJleHAiOjE3Mjc3MjI4MjQsInR5cGUiOiJhY2Nlc3MifQ.IuLDMoiCUiIBuXYE0-0ai5fKT9FJYFnmyO-m-_gKdFY", number:5 },
  // { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZjQzNTc1MDIzMDkwNjNkODc4YzRhIiwiaWF0IjoxNzI3NjM2NDI0LCJleHAiOjE3Mjc3MjI4MjQsInR5cGUiOiJhY2Nlc3MifQ.IuLDMoiCUiIBuXYE0-0ai5fKT9FJYFnmyO-m-_gKdFY", number:6 },

];


makeMoney(tokensAndNumbers);

console.log("Executed: Started...");
