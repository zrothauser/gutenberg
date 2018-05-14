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
        tableView.register(WrapperCell.self, forCellReuseIdentifier: cellIdentifier)
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
        // only add it if we don't have an item already
        if !data.contains(where: { (item) -> Bool in
            item.itemIndex == listItem.itemIndex
        }) {
            data.append(listItem)
        }
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
        let view = data[indexPath.row]
        cell.contentView.addSubview(view)
        NSLayoutConstraint.activate([
            view.leftAnchor.constraint(equalTo: cell.contentView.leftAnchor),
            view.rightAnchor.constraint(equalTo: cell.contentView.rightAnchor),
            view.topAnchor.constraint(equalTo: cell.contentView.topAnchor),
            view.bottomAnchor.constraint(equalTo: cell.contentView.bottomAnchor)
            ])
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

    func makeIndexPaths(from: Int, count: Int) -> [IndexPath] {
        var indices = [IndexPath]()
        for i in 0..<count {
            indices.append(IndexPath(row: from + i, section:0))
        }
        return indices
    }
    @objc func insertItems(at: Int, amount:Int) {
        tableView.beginUpdates()
        let indices: [IndexPath] = makeIndexPaths(from: at, count: amount)
        tableView.insertRows(at: indices, with: .automatic)
        dataSize = dataSize + amount
        tableView.endUpdates()
    }

    @objc func removeItems(at: Int, amount:Int) {
        tableView.beginUpdates()
        let indices: [IndexPath] = makeIndexPaths(from: at, count: amount)

        tableView.deleteRows(at: indices, with: .automatic)
        data.removeSubrange(at..<at+amount)
        tableView.endUpdates()
    }
}

class WrapperCell: UITableViewCell {

    override init(style: UITableViewCellStyle, reuseIdentifier: String?) {
        super.init(style: .default, reuseIdentifier: reuseIdentifier)
    }

    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
}
