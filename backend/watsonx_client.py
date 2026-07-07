import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

URL = "https://eu-gb.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29"


def get_access_token(retries=3):

    for attempt in range(retries):

        try:

            response = requests.post(
                "https://iam.cloud.ibm.com/identity/token",
                headers={
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data={
                    "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
                    "apikey": os.getenv("WATSONX_API_KEY")
                },
                timeout=30
            )

            response.raise_for_status()

            return response.json()["access_token"]

        except requests.exceptions.Timeout:
            print(f"Token request timed out (Attempt {attempt + 1}/{retries})")

        except requests.exceptions.ConnectionError:
            print(f"Token request failed (Attempt {attempt + 1}/{retries})")

        except requests.exceptions.HTTPError as e:
            print("HTTP Error:", e)
            raise

        time.sleep(2)

    raise Exception("Failed to obtain IBM access token.")




def ask_llm(prompt, retries=3):

    token = get_access_token()

    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }

    body = {
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "project_id": os.getenv("PROJECT_ID"),
        "model_id": os.getenv("MODEL_ID"),
        "max_tokens": 500,
        "temperature": 0.7,
        "top_p": 1
    }

    for attempt in range(retries):

        try:

            response = requests.post(
                URL,
                headers=headers,
                json=body,
                timeout=60
            )

            response.raise_for_status()

            result = response.json()

            return result["choices"][0]["message"]["content"]

        except requests.exceptions.Timeout:

            print(f"\nRequest timed out (Attempt {attempt + 1}/{retries})")

        except requests.exceptions.ConnectionError:

            print(f"\nConnection failed (Attempt {attempt + 1}/{retries})")

        except requests.exceptions.HTTPError as e:

            print("\nHTTP Error:", e)
            raise

        except Exception as e:

            print("\nUnexpected Error:", e)
            raise

        time.sleep(2)

    raise Exception("Watsonx request failed after multiple retries.")