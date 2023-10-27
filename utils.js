const axios = require("axios")
const cheerio = require("cheerio")
const { faker } = require("@faker-js/faker")
const fakerid = require("@faker-js/faker/locale/id_ID")
var Formdata = require("form-data")
const fetch = require("node-fetch")

//random device id like 16944100962836506456
function generateRandomDeviceID(length) {
  const characters = "0123456789"
  let deviceID = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    deviceID += characters.charAt(randomIndex)
  }

  return deviceID
}

function generateRandomIndonesianPhoneNumber() {
  // Define Indonesian country code and area codes
  const areaCodes = [
    "21",
    "22",
    "24",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "61",
    "62",
    "63",
    "64",
    "65",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
  ]

  // Select a random area code
  const randomAreaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)]

  // Generate a random 7-digit local number
  const randomLocalNumber = Math.floor(Math.random() * 9000000) + 1000000

  // Combine all parts to create the phone number
  const phoneNumber = `85${randomAreaCode}${randomLocalNumber}`

  return phoneNumber
}

async function randUserAgent(type = "mozila") {
  const resagent = await new Promise((resolve, reject) => {
    fetch(`https://iplogger.org/useragents/?device=${type}&count=10`, {
      method: "get",
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,/;q=0.8",
        "accept-encoding": "gzip, deflate, br",
        "upgrade-insecure-requests": 1,
        "user-agent":
          "Mozilla/5.0 (Linux; Android 10; SM-A107F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Mobile Safari/537.36",
      },
    })
      .then((res) => res.text())
      .then((text) => {
        const $ = cheerio.load(text)
        const result = []
        // console.log(text);
        $(".random-useragent")
          .find(".random-useragent-row")
          .each(function (index, element) {
            //get text in class .copy
            result.push($(element).find(".copy").text())
          })
        resolve(result)
      })
      .catch((err) => reject(err))
  })
  return resagent[Math.floor(Math.random() * 10)]
}

async function generateFakeUser() {
  const useragent = await randUserAgent()
  return {
    fullname:
      fakerid.name.firstName().toLowerCase() +
      " " +
      fakerid.name.lastName().toLowerCase(),
    firstname: fakerid.name.firstName().toLowerCase(),
    lastname: fakerid.name.lastName().toLowerCase(),
    address: fakerid.address.streetAddress().toLowerCase(),
    phone: generateRandomIndonesianPhoneNumber(),
    device_id: generateRandomDeviceID(20),
    useragent,
    dob: generateRandomDateOfBirth(),
  }
}

async function getindoname() {
  return new Promise((resolve, reject) => {
    // Create a new FormData instance
    const form = new FormData()

    // Append form data fields
    form.append("number_generate", 1)
    form.append("gender_type", "male")
    form.append("submit", "Generate")

    axios
      .post("http://ninjaname.net/indonesian_name.php", form, {
        responseType: "text", // Remove '.html' from 'text/html'
      })
      .then((res) => {
        // Check if the response status is OK (200)
        if (res.status === 200) {
          // console.log(res.data)
          return res.data // Return the response data
        } else {
          throw new Error(`Request failed with status ${res.status}`)
        }
      })
      .then((text) => {
        const $ = cheerio.load(text)
        const hasil = $(
          "body > div > div.page > div.body > div.content > div:nth-child(5)"
        ).text()
        resolve(hasil)
      })
      .catch((err) => reject(err))
  })
}

//add 0 if day or month < 10
function addZero(number) {
  return number < 10 ? "0" + number : number
}

//random date of birth min 18 years old from year now
function generateRandomDateOfBirth() {
  const currentYear = new Date().getFullYear()
  const year = currentYear - Math.floor(Math.random() * 18)
  const month = Math.floor(Math.random() * 12) + 1
  const day = Math.floor(Math.random() * 28) + 1
  return {
    day: addZero(day),
    month: addZero(month),
    year,
  }
}

async function getEmailRandom(name) {
  try {
    const domainList = await new Promise((resolve, reject) => {
      fetch(`https://generator.email/`, {
        method: "get",
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
          "accept-encoding": "gzip, deflate, br",
        },
      })
        .then((res) => res.text())
        .then((text) => {
          const $ = cheerio.load(text)
          const result = []
          $(".e7m.tt-suggestions")
            .find("div > p")
            .each(function (index, element) {
              result.push($(element).text())
            })
          resolve(result)
        })
        .catch((err) => reject(err))
    })
    const domain = domainList[Math.floor(Math.random() * domainList.length)]
    const email = name + "@" + domain
    return email
  } catch (err) {
    return err
  }
}

function randomString(length) {
  let result = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const cookieHelpers = (arrayCookie) => {
  let newCookie = ""
  for (let index = 0; index < arrayCookie.length; index++) {
    const element = arrayCookie[index]
    if (index < arrayCookie.length - 1) {
      newCookie += element.split(";")[0] + "; "
    } else {
      newCookie += element.split(";")[0]
    }
  }
  return newCookie
}

const getCountryCode = async () => {
  return new Promise((resolve, reject) => {
    fetch(
      "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json"
    )
      .then((res) => resolve(res.json()))
      .catch((err) => reject(err))
  })
}

module.exports = {
  generateRandomDeviceID,
  generateRandomIndonesianPhoneNumber,
  randUserAgent,
  generateFakeUser,
  generateRandomDateOfBirth,
  getEmailRandom,
  randomString,
  getindoname,
  cookieHelpers,
  getCountryCode,
}
