const axios = require("axios")
const fs = require("fs")
const proxyconfig = require("./proxyconfig.json")
const readline = require("readline-sync")
const fetch = require("node-fetch")
const chalk = require("chalk")
const {
  generateRandomIndonesianPhoneNumber,
  randUserAgent,
} = require("./utils")

const sendotp = async ({ phone, useragent }) => {
  try {
    const axios2 = axios.create()
    const res = await axios2({
      url: "https://api.xtnminer.com/verify",
      method: "POST",
      data: {
        phone: `0${phone}`,
      },
      headers: {
        authority: "api.xtnminer.com",
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        origin: "https://xtnminer.com",
        referer: "https://xtnminer.com/",
        "sec-ch-ua":
          '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Api-Key": "apikeytestforneutrino",
        "user-agent": useragent,
      },
    })
    return res?.data
  } catch (err) {
    // console.log(err)
    return null
  }
}

const register = async ({ phone, useragent, password, otp, kodereff }) => {
  try {
    const axios2 = axios.create()
    const res = await axios2({
      url: "https://api.xtnminer.com/user/register",
      method: "POST",
      data: {
        phone,
        password: password,
        passwordConfirm: password,
        verificationCode: otp,
        inviteCode: kodereff,
        agreeToPolicy: true,
        pin: "123456",
      },
      headers: {
        authority: "api.xtnminer.com",
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        origin: "https://xtnminer.com",
        referer: "https://xtnminer.com/",
        "sec-ch-ua":
          '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "Api-Key": "apikeytestforneutrino",
        "user-agent": useragent,
      },
      proxy: proxyconfig?.host ? proxyconfig : null,
    })
    return res?.data
  } catch (err) {
    // console.log(err)
    return null
  }
}

const login = async (phone, passakun, useragent) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.xtnminer.com/user/login", {
      method: "POST",
      headers: {
        "user-agent": useragent,
        "Api-Key": "apikeytestforneutrino",
      },
      body: new URLSearchParams({
        phone,
        password: passakun,
      }),
    })
      .then(async (res) => {
        resolve(res.json())
      })
      .catch((err) => {
        console.log(err)
        reject(null)
      })
  })
}

const checkStatus = async (token, useragent) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.xtnminer.com/user/login/status", {
      method: "GET",
      headers: {
        "Api-Key": "apikeytestforneutrino",
        "user-agent": useragent,
        authorization: `${token}`,
      },
    })
      .then(async (res) => {
        resolve(res.json())
      })
      .catch((err) => reject(null))
  })
}

const checkin = async (day, token, useragent) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.xtnminer.com/user/checkin", {
      method: "POST",
      body: JSON.stringify({
        day,
      }),
      headers: {
        "user-agent": useragent,
        "Api-Key": "apikeytestforneutrino",
        authorization: `${token}`,
      },
    })
      .then(async (res) => {
        resolve(res.json())
      })
      .catch((err) => reject(null))
  })
}

const claimReff = async (token, useragent) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.xtnminer.com/user/claimTask?taskId=1", {
      method: "GET",
      headers: {
        "user-agent": useragent,
        "Api-Key": "apikeytestforneutrino",
        authorization: `${token}`,
      },
    })
      .then(async (res) => {
        resolve(res.json())
      })
      .catch((err) => reject(null))
  })
}

const lucckyDraw = async (token, useragent) => {
  return new Promise((resolve, reject) => {
    fetch("https://api.xtnminer.com/user/luckyDraw", {
      method: "GET",
      headers: {
        "user-agent": useragent,
        "Api-Key": "apikeytestforneutrino",
        authorization: `${token}`,
      },
    })
      .then(async (res) => {
        resolve(res.json())
      })
      .catch((err) => reject(null))
  })
}

const main = async () => {
  var index = 1
  console.clear()
  console.log(`\nDaftar Menu `)
  console.log(`1. Buat Akun + Checkin + Kerjain Misi`)
  console.log(`2. Kerjain Misi + Checkin Doang`)
  console.log(`3. Cek akun Aja`)
  const pilihan = readline.question(`\nSila pilih menu (1/2/3): `)
  console.log("")
  switch (pilihan) {
    case "1":
      {
        const jumlah = readline.question("Berapa Akun   : ")
        const passakun = readline.question("Password Akun : ")
        const kodereff = readline.question("Kode reff     : ")
        console.log("")
        while (true) {
          const useragent = await randUserAgent()
          const phone = `${generateRandomIndonesianPhoneNumber()}`

          console.log(chalk.yellow(`${index} ${phone}`))
          const resotp = await sendotp({
            phone,
            useragent,
          })

          if (resotp?.success !== true) {
            console.log(
              chalk.red(`${index} ${resotp?.message || "Terjadi kesalahan"}`)
            )
            continue
          }
          const data = {
            phone,
            otp: resotp?.code,
            useragent,
            password: passakun,
            kodereff,
          }
          const res = await register(data)

          if (!res?.success) {
            console.log(
              chalk.red(`${index} ${res?.message || "Terjadi kesalahan"}`)
            )
            continue
          }
          console.log(chalk.green(`${index} ${res?.message}`))

          let loginres = await login(phone, passakun, useragent)

          let maxcount = 0

          while (!loginres?.success) {
            console.log(chalk.red(`${index} Login gagal, mencoba lagi`))
            loginres = await login(phone, useragent)
            if (loginres?.message === "Login berhasil") {
              break
            }
            await new Promise((resolve) => setTimeout(resolve, 1000))
            if (maxcount > 2) {
              console.log("")
              break
            }
            maxcount++
          }

          if (!loginres?.success) {
            console.log(`${index} Gagal login, melewatkan akun ini\n`)
            continue
          }
          // console.log(loginres)
          // return
          console.log(chalk.green(`${index} ${loginres?.message}`))
          const checkstatusres = await checkStatus(loginres?.token, useragent)
          if (!checkstatusres?.authenticated) {
            console.log(chalk.red(`${index} ${checkstatusres?.message}`))
            continue
          }

          console.log(chalk.green(`${index} ${checkstatusres?.message}`))
          const checkinres = await checkin(
            checkstatusres?.data?.checkin,
            loginres?.token,
            useragent
          )
          if (!checkinres?.success) {
            console.log(chalk.red(`${index} ${checkinres?.message}`))
            continue
          }
          console.log(chalk.green(`${index} ${checkinres?.message}`))

          const formatedData = `${phone}|${passakun}\n`
          fs.appendFileSync("akun-neutrino.txt", formatedData)
          console.log(chalk.green(`${index} Akun tersimpan\n`))

          console.log(`[+] Mengerjakan misi invite`)
          let jumlahinvite = 1
          while (true) {
            const useragent = await randUserAgent()
            const phone = `${generateRandomIndonesianPhoneNumber()}`

            console.log(chalk.yellow(`${jumlahinvite} ${phone}`))
            const resotp = await sendotp({
              phone,
              useragent,
            })

            if (resotp?.success !== true) {
              console.log(
                chalk.red(
                  `${jumlahinvite} ${resotp?.message || "Terjadi kesalahan"}`
                )
              )
              continue
            }
            const data = {
              phone,
              otp: resotp?.code,
              useragent,
              password: passakun,
              kodereff: checkstatusres?.data?.user,
            }
            const res = await register(data)

            if (!res?.success) {
              console.log(
                chalk.red(
                  `${jumlahinvite} ${res?.message || "Terjadi kesalahan"}`
                )
              )
              continue
            }
            console.log(chalk.green(`${jumlahinvite} ${res?.message}`))
            jumlahinvite++
            if (jumlahinvite > 3) {
              break
            }
          }
          const claimres = await claimReff(loginres?.token, useragent)
          if (!claimres?.success) {
            console.log(chalk.red(`${index} ${claimres?.message}`))
            continue
          }
          console.log(chalk.green(`${index} ${claimres?.message}`))
          const luckydrawres = await lucckyDraw(loginres?.token, useragent)
          if (!luckydrawres?.success) {
            console.log(chalk.red(`${index} ${luckydrawres?.message}`))
            continue
          }
          console.log(chalk.green(`${index} ${luckydrawres?.winner?.name}`))
          console.log("")
          index++
          if (index > jumlah) {
            console.log(`Selesai bang!\n`)
            process.exit()
          }
        }
      }
      break
    default:
      console.log(chalk.red(`Menu tidak tersedia`))
      process.exit()
      break
  }
}

main()
