import Foundation
import UIKit

@objc class RecyclerListView: UIView {

    fileprivate var data = [RecyclerListItemView]()

    let cellIdentifier = "RecycleCell"
    
    lazy var tableView: UITableView = {
        return UITableView(frame: self.frame, style: .plain)
    }()
    
    @objc override init(frame: CGRect) {
        super.init(frame: frame)
        commonInit()
    }
    
    @objc required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        commonInit()
    }
    
    func commonInit() {
        tableView.dataSource = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: cellIdentifier)
        addSubview(tableView)        
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        tableView.frame = bounds
    }

    override func addSubview(_ view: UIView) {
        // if we are adding another thing let's ignore it
        guard let listItem = view as? RecyclerListItemView else {
            super.addSubview(view)
            return
        }
        data.append(listItem)
    }
}

extension RecyclerListView: UITableViewDataSource {

    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier, for: indexPath)
        cell.contentView.addSubview(data[indexPath.row])
        return cell
    }
}

extension RecyclerListView {

    @objc var dataSize: Int {
        set {
//            data.removeAll()
//            for i in 0..<newValue {
//                data.append("Item \(i)")
//            }
//            tableView.reloadData()
        }

        get {
            return data.count
        }
    }

    @objc func scroll(to: Int, animated: Bool) {
        tableView.scrollToRow(at: IndexPath(row: to, section: 0), at: .top, animated: animated)
    }

    @objc func moveCell(from: Int, to: Int) {
        tableView.beginUpdates()
        tableView.moveRow(at: IndexPath(row: from, section: 0), to: IndexPath(row: to, section: 0))
        data.swapAt(from, to)
        tableView.endUpdates()
    }

    @objc func insertItems(at: Int, amount:Int) {
        tableView.beginUpdates()
        let indeces: [IndexPath] = {
            var indeces = [IndexPath]()
            for i in 0..<amount {
                indeces.append(IndexPath(row: at+i, section:0))
            }
            return indeces
        }()
        tableView.insertRows(at: indeces, with: .automatic)
        dataSize = dataSize + amount
        tableView.endUpdates()
    }

    @objc func removeItems(at: Int, amount:Int) {
        tableView.beginUpdates()
        let indeces: [IndexPath] = {
            var indeces = [IndexPath]()
            for i in 0..<amount {
                indeces.append(IndexPath(row: at+i, section:0))
            }
            return indeces
        }()
        tableView.deleteRows(at: indeces, with: .automatic)
        dataSize = dataSize - amount
        tableView.endUpdates()
    }
}
