import asyncio
import logging
import os
from datetime import datetime

import aiohttp
import serial

BASE_URL = os.environ.get('CDTP_SERVER', 'http://localhost/')
USER = os.environ.get('CDTP_USERNAME', 'user')
PASS = os.environ.get('CDTP_PASSWORD', 'pass')

interval = 5

logging.basicConfig(level=logging.DEBUG)


async def interval_task(stream):
    while True:
        async with aiohttp.ClientSession(auth=aiohttp.BasicAuth(USER, PASS)) as session:
            raw_data = stream.readline()
            stream.flushInput()
            temperature = raw_data.decode("utf-8").strip()
            date = datetime.now().isoformat()
            logging.debug(f"Current temperature: {temperature} date: {date}")

            payload = {
                'date': date,
                'currentTemp': temperature,
            }

            async with session.post(f'{BASE_URL}', json=payload) as resp:
                if resp.status != 200:
                    logging.warning(f'Got status code: {resp.status} from url: {BASE_URL}/ '
                                    f'response: {await resp.text()} ')

            async with session.get(f'{BASE_URL}desired-temp') as resp:
                if resp.status != 200:
                    logging.warning(f'Got status code: {resp.status} from url: {BASE_URL}/desired-temp '
                                    f'response: {await resp.text()}')
                else:
                    desired_temp = await resp.json()
                    stream.write(f"{desired_temp['desiredTemp']}\n".encode("utf-8"))
                    logging.debug(f'Desired Temp: {desired_temp}')

        await asyncio.sleep(interval)


async def init_client(port='COM1'):
    while True:
        logging.info(f'Trying to connect port: {port}')
        try:
            stream = serial.Serial(port, 9600)
            stream.write(b"X")
        except Exception as e:
            logging.critical(e)
            logging.info(f'Trying to reconnect in {interval} seconds')
            await asyncio.sleep(interval)
            continue
        await interval_task(stream)


asyncio.run(init_client())
