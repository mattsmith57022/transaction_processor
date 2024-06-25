require 'csv'
require 'date'
require 'securerandom'

def generate_data(file_name, num_transactions)
  CSV.open(file_name, "wb") do |csv|
    csv << ["timestamp", "branch_code", "amount"]

    num_transactions.times do
      timestamp = (DateTime.now - rand(365)).strftime("%Y-%m-%d %H:%M:%S")
      branch_code = format('%05d', rand(1..99_999))
      amount = format('%.2f', rand(1.00..1000.00))

      csv << [timestamp, branch_code, amount]
    end
  end
end

generate_data("financial_transactions.csv", 200_000_000)
