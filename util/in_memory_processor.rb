require 'csv'

def process_transactions(filename)
  branch_data = Hash.new do |hash, key|
    hash[key] = { min: Float::INFINITY, max: -Float::INFINITY, sum: 0, count: 0 }
  end

  CSV.foreach(filename, headers: true) do |row|
    branch_code = row['branch_code']
    amount = row['amount'].to_f

    branch_data[branch_code][:min] = [branch_data[branch_code][:min], amount].min
    branch_data[branch_code][:max] = [branch_data[branch_code][:max], amount].max
    branch_data[branch_code][:sum] += amount
    branch_data[branch_code][:count] += 1
  end

  branch_data.each do |branch_code, data|
    average = data[:sum] / data[:count]
    puts "Branch: #{branch_code}, Min: $#{format('%.2f', data[:min])}, Max: $#{format('%.2f', data[:max])}, Average: $#{format('%.2f', average)}"
  end;nil
end

process_transactions("financial_transactions.csv")
