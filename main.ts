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
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZjQ0MmU1MDIzMDkwNjNkODkwNzJmIiwiaWF0IjoxNzI3Mjk5NDgzLCJleHAiOjE3MjczODU4ODMsInR5cGUiOiJhY2Nlc3MifQ.5S7kDyWXEE7uuD9rToB--7cK6b1PVcYVl1EwXC_ph1E", number: 1 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzEwNTc2M2Y3Mzg1MGY4M2ZkN2Y1IiwiaWF0IjoxNzI3MzY5Mzc1LCJleHAiOjE3Mjc0NTU3NzUsInR5cGUiOiJhY2Nlc3MifQ.yAEWWHkbDOmoRTNp1WNiQ2oSOBQQqLxw7rXKBWqy1LM", number: 2 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzE2M2E5YTlkNTdkOTNmZmJhZDcxIiwiaWF0IjoxNzI3MzY5NjkwLCJleHAiOjE3Mjc0NTYwOTAsInR5cGUiOiJhY2Nlc3MifQ.7vWMOjWxXwrJJu32tyjQ1uCKEJNxMn9Ihsa97yHkWe8", number: 3 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlYzE4YTM5YTlkNTdkOTNmMDAzODU4IiwiaWF0IjoxNzI3MzY5ODQzLCJleHAiOjE3Mjc0NTYyNDMsInR5cGUiOiJhY2Nlc3MifQ.8nAM8wsENeEAV-P6EI6jB8YdcgkwbXFO31y3yMrkoUI", number: 4 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTAzZDk1NGI2OTAxNzgwMDk5ZWE5IiwiaWF0IjoxNzI3MzY5OTU3LCJleHAiOjE3Mjc0NTYzNTcsInR5cGUiOiJhY2Nlc3MifQ.ccNPKsrJacwdCakRSfEDb5jc44VIG0FEvFjnJohkUlA", number: 5 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA0NWMxMjM0Y2ZkYTZlZDc5Yjk5IiwiaWF0IjoxNzI3MzcwMDM1LCJleHAiOjE3Mjc0NTY0MzUsInR5cGUiOiJhY2Nlc3MifQ.rxRlWhL1E9NqLRsci293y3wdF2LiqSzycwRyTuoZNCo", number: 6 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA0ZTEyYTgxMGEwYjQ1OGJjMjI1IiwiaWF0IjoxNzI3MzcwMTY3LCJleHAiOjE3Mjc0NTY1NjcsInR5cGUiOiJhY2Nlc3MifQ.JgILUPR_uTqvprC4nIwoVijX3ECc83xslW61P05ekvE", number: 7 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZTA2NWEyYTgxMGEwYjQ1OGQ0NWU0IiwiaWF0IjoxNzI3MzcwMjQ1LCJleHAiOjE3Mjc0NTY2NDUsInR5cGUiOiJhY2Nlc3MifQ.cNPb5oYMbiVdQaF4xhfOt6SlQQZnRNStVhEIpExdW04", number: 8 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZjQzNTc1MDIzMDkwNjNkODc4YzRhIiwiaWF0IjoxNzI3MzcwMzg4LCJleHAiOjE3Mjc0NTY3ODgsInR5cGUiOiJhY2Nlc3MifQ.oG8R3o5zIDh38gN2f3GcEfI2hnOEu1GFC5sneFvAnJg", number: 9 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2ZhYzI2M2Y3Mzg1MGY4YjJjYTRiIiwiaWF0IjoxNzI3Mzg4MTE5LCJleHAiOjE3Mjc0NzQ1MTksInR5cGUiOiJhY2Nlc3MifQ.AYfs-PgPM4aDaQbz7mJ7n7dvUiX5yeBwBwZYjfpAZIk", number: 10 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZkZGZiNjYxZjdmMGYxNGZmYzkxNDAyIiwiaWF0IjoxNzI3Mzg4MzMwLCJleHAiOjE3Mjc0NzQ3MzAsInR5cGUiOiJhY2Nlc3MifQ.Jimqsh8WQT9rQ3pLFWskprrGchBp9mWiyBAjWQtRKUI", number: 11 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2Y2OThmZjM0YmE2YzMyYzM3ZGFmIiwiaWF0IjoxNzI3Mzg4NDEyLCJleHAiOjE3Mjc0NzQ4MTIsInR5cGUiOiJhY2Nlc3MifQ.jNlbY3IH48_0BjPEfTdmAChq77NuQaiqpbvKE9YjUtE", number: 12 },

];


makeMoney(tokensAndNumbers);

console.log("Executed: Started...");
