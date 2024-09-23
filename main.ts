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
      return now+10 ; // زمان پیش‌فرض
    }

    const data = await res.json();
    return data["SPECIAL MISSION"][0]["next_time_execute"];
  } catch (error) {
    console.error('Error in getNextTime:', error);
    const now = Math.floor(Date.now() / 1000);
    return now+10 ; // زمان پیش‌فرض
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
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlZjQ0MmU1MDIzMDkwNjNkODkwNzJmIiwiaWF0IjoxNzI3MDg2MTU5LCJleHAiOjE3MjcxNzI1NTksInR5cGUiOiJhY2Nlc3MifQ.eUrmRQhBtBq-uH0S1RoOfSsoRo6hCaunWVnFW8A6F6Q", number: 1 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2ZhYzI2M2Y3Mzg1MGY4YjJjYTRiIiwiaWF0IjoxNzI3MDg3MjQzLCJleHAiOjE3MjcxNzM2NDMsInR5cGUiOiJhY2Nlc3MifQ._5dKgndhahz5eCGjOqcF9qngi8kLq3k6cjOTnY2vmqk", number: 2 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZkZGZiNjYxZjdmMGYxNGZmYzkxNDAyIiwiaWF0IjoxNzI3MDg3ODczLCJleHAiOjE3MjcxNzQyNzMsInR5cGUiOiJhY2Nlc3MifQ.5T8maHwUF6Prt9T-KtaQAyGXqYKlKoxFl1e7AkBeKUk", number: 3 },
  { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjZlN2Y2OThmZjM0YmE2YzMyYzM3ZGFmIiwiaWF0IjoxNzI3MDg4MDUxLCJleHAiOjE3MjcxNzQ0NTEsInR5cGUiOiJhY2Nlc3MifQ.Ql0gEyia5_6yMimfSLUH3MO1RR-49arZAqb1UT1B6ZU", number: 4 },
];


makeMoney(tokensAndNumbers);

console.log("Executed: Started...");
