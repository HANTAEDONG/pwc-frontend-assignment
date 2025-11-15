import fs from "fs";
import path from "path";
import axios from "axios";
import AdmZip from "adm-zip";
import { parseString } from "xml2js";
import { promisify } from "util";
import dotenv from "dotenv";

dotenv.config();

const parseXML = promisify(parseString);

interface CompanyData {
  corp_code: string;
  corp_name: string;
  stock_code?: string;
}

async function main() {
  const dartApiKey = process.env.NEXT_PUBLIC_DART_API_KEY;

  if (!dartApiKey) {
    console.error("NEXT_PUBLIC_DART_API_KEY 환경 변수가 설정되지 않았습니다.");
    process.exit(1);
  }

  console.log("DART API에서 기업 코드 목록 다운로드 중...");

  try {
    // DART API에서 ZIP 파일 다운로드
    const response = await axios.get(
      `https://opendart.fss.or.kr/api/corpCode.xml?crtfc_key=${dartApiKey}`,
      {
        responseType: "arraybuffer",
      }
    );

    const zipBuffer = Buffer.from(response.data);
    const zip = new AdmZip(zipBuffer);

    // CORPCODE.xml 파일 추출
    const xmlEntry = zip.getEntry("CORPCODE.xml");
    if (!xmlEntry) {
      throw new Error("CORPCODE.xml 파일을 찾을 수 없습니다.");
    }

    const xmlContent = xmlEntry.getData().toString("utf-8");

    console.log("XML 파싱 중...");

    // XML 파싱
    const result = (await parseXML(xmlContent)) as {
      result?: {
        list?: Array<{
          corp_code?: string | string[];
          corp_name?: string | string[];
          stock_code?: string | string[];
        }>;
      };
    };
    const companies: CompanyData[] = [];

    // XML 구조에 따라 데이터 추출
    if (result.result?.list) {
      const list = Array.isArray(result.result.list)
        ? result.result.list
        : [result.result.list];

      for (const item of list) {
        const corpCode = Array.isArray(item.corp_code)
          ? item.corp_code[0]
          : item.corp_code;
        const corpName = Array.isArray(item.corp_name)
          ? item.corp_name[0]
          : item.corp_name;
        const stockCode = Array.isArray(item.stock_code)
          ? item.stock_code[0]
          : item.stock_code;

        if (corpCode && corpName) {
          companies.push({
            corp_code: corpCode,
            corp_name: corpName,
            stock_code: stockCode || undefined,
          });
        }
      }
    }

    console.log(`총 ${companies.length}개의 기업 정보를 추출했습니다.`);

    // public 폴더에 JSON 파일 저장
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const outputPath = path.join(publicDir, "corp-codes.json");
    fs.writeFileSync(outputPath, JSON.stringify(companies, null, 2), "utf-8");

    console.log(`✅ ${outputPath}에 저장 완료!`);
  } catch (error) {
    console.error("오류 발생:", error);
    process.exit(1);
  }
}

main();
