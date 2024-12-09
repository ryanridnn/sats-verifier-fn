import axios from "axios";
import data from "./formatted.json";

const config = {
  headers: {
    accept: "application/json",
    "accept-language": "en-US,en;q=0.9",
    authorization:
      "Bearer eyjhbgcioijsuzi1niisinr5cci6ikpxvcisimtpzci6imhes0dfck9togrvcnfnvlzsq21pxyj9.eyjpc3mioijodhrwczovl2f1dgguzglkz2uuaw8viiwic3viijoiyxv0adb8njnizmuzntfjodvjmdvkymrlmji2zmy4iiwiyxvkijpbimfwcc5kawrnzs5pbyisimh0dhbzoi8vchjvzc10endlbc16ay5hds5hdxromc5jb20vdxnlcmluzm8ixswiawf0ijoxnzmznzm5mzgwlcjlehaioje3mzm4mju3odasinnjb3blijoib3blbmlkihbyb2zpbgugzw1hawwgb2zmbgluzv9hy2nlc3milcjhenaioijltksxdlbud3i2qkvvzgy0y1bxckzxeml6cfruampxwsj9.j1l_tjuefhdpe8tjdzmeep1urpxdtqeuc3heo9cabxhp7994zegkk2duzjn-iixmm1zmtte2cgwwy686qxx-phivpuapvfxma50201tsjrtrohhoz7onbxpd8as7hkphia1czgmu_uhvisfzag9cclyhzkwafusxfummxqcq7lhpwoaddmkvsjsgia_owapzqsfflhccmronb6nrc_24zwk5yh7xzfwz3gxmbilffdcphzgvoepuxdzmls8shk-f2igs2nqdr7ctrxcixbpuzwab8e5rvfc4pbclzuez7skqis2xwpzteux5cxfjeb694l0csvcctlwgoejmmvxypq",
    "if-none-match": 'W/"1f864-mzJ1eKdL7xFukf5bNvlqZuR3ixw"',
    priority: "u=1, i",
    "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Brave";v="128"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "sec-gpc": "1",
  },
};

let completed = 0;
const isNumber = (n: any) => typeof n === "number";

const verifyOp = (settings: any) => {
  let overall: "fatal" | "warning" | "good" = "good";
  let messages: string[] = [];

  if (typeof settings === "object" && settings) {
    const { selectResource, verif, mainTitle, classes } = settings;

    if (!selectResource) {
      overall = "fatal";

      messages.push(
        `No selectResource or invalid selectResource; value = ${selectResource}`,
      );
    } else {
      if (!["sicc1", "sicc2"].includes(selectResource)) {
        overall = "fatal";

        messages.push(`invalid selectResource; value = ${selectResource}`);
      }
    }

    if (!verif) {
      overall = "fatal";
      messages.push("No link to verification");
    } else {
      if (!verif.id) {
        messages.push("Invalid link to the verification: MISSING ID");
        overall = "fatal";
      }

      if (typeof verif.ids === "object" && verif) {
        let ids = ["network", "site", "department", "workArea", "operation"];

        let missing: string[] = [];

        ids.forEach((key) => {
          if (!verif.ids[key]) {
            missing.push(key);
          }
        });

        if (missing.length > 0) {
          overall = "fatal";

          messages.push(
            `Invalid link to verification: MISSING IDS DETAILS, HERE ${missing.join(", ")}`,
          );
        }
      } else {
        overall = "fatal";
        messages.push("Invalid linkm to verification: MISSING IDS DETAILS");
      }
    }

    if (!mainTitle) {
      overall = "warning";

      messages.push("No operation title");
    }

    if (Array.isArray(classes)) {
      if (classes.length < 11) {
        overall = "fatal";

        messages.push("Classes are less than 11");
      } else {
        const valid = classes.every((c) => {
          return (
            c.name &&
            isNumber(c.temperature) &&
            isNumber(c.overtimeLimit) &&
            isNumber(c.warningTimeLimit)
          );
        });

        if (!valid) {
          overall = "fatal";

          messages.push("Invalid class details: MISING INTERNAL FIELDS");
        }
      }
    } else {
      (overall = "fatal"), messages.push("No classes saved");
    }

    return {
      overall,
      messages,
    };
  } else {
    overall = "fatal";
    return {
      overall,
      messages: ["Settings Object is empty"],
    };
  }
};

const operations = await Promise.all(
  data.map(async (o) => {
    const url = `https://api2.didge.io/api/networks/${o.networkId}/sites/${o.siteId}/departments/${o.departmentId}/operations/${o._id}`;

    const res = await axios.get(url, config);

    completed++;

    const settings = res.data.settings.settings;

    const result = verifyOp(settings);

    return {
      // __OPERATION_ID__: o._id,
      // ...settings,
      result,
      details: o,
    };
  }),
);

Bun.write("./operations.json", JSON.stringify(operations, null, 2));
