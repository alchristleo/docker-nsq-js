url="localhost:3000/subnet"

## Customize your own prefix ip
a="125.170."

for i in {1..100}; do
        b="${a}${i}"      
        content="$(curl --location --request POST 'http://localhost:3000/subnet' \
                --header 'Content-Type: application/json' \
                --data-raw '{
                        "subnetip": "'$b'"
                }')"
        echo "$b" >> output.txt
done