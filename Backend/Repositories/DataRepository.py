from .Database import Database


class DataRepository:
    @staticmethod
    def json_or_formdata(request):
        if request.content_type == 'application/json':
            gegevens = request.get_json()
        else:
            gegevens = request.form.to_dict()
        return gegevens

    @staticmethod
    def insert_data(name, score, time):
        sql = "INSERT INTO scoreboard (name, score, time) VALUES (%s, %s, %s);"
        params = [name, score, time]
        return Database.execute_sql(sql, params)

    @staticmethod
    def read_data():
        sql = "SELECT name, score, cast(time as char) as time FROM scoreboard order by time, score desc;"
        return Database.get_rows(sql)
