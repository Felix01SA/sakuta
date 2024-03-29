import { CronJob } from 'cron'
import { singleton } from 'tsyringe'

@singleton()
export class Cron {
    private _jobs: Map<string, CronJob> = new Map()

    get jobs() {
        return this._jobs
    }

    addJob(id: string, job: CronJob<any, any>) {
        this._jobs.set(id, job)
    }

    startJob(id: string) {
        this._jobs.get(id)?.start()
    }

    startAllJobs() {
        this._jobs.forEach((job) => job.start())
    }

    stopJob(id: string) {
        this._jobs.get(id)?.stop()
    }

    stopAllJobs() {
        this._jobs.forEach((job) => job.stop())
    }
}
